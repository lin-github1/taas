# -*- coding: utf-8 -*-
"""
-------------------------------------------------------------------------------
@author  :sdc_os
@time    :2020/02/10
@file    :demo.py
@desc    :demo示例
@license :(c) Copyright 2020, SDC.
-------------------------------------------------------------------------------
"""
import logging
import time
from rest_framework import viewsets

from whiteBox.models import TaskInfo, amtResult, BasisInfo
from whiteBox.utils.amt_client import amt_client
from whiteBox.utils.decorators import api_action as action
# from whiteBox.utils.amt_client import AMTClient
from whiteBox.utils.public import PublicOperation


class CallBack(viewsets.ViewSet):
    """
        Demo 获取数据
    """
    # 以下参数会取消该类中的接口认证，正式环境需要考虑接口是否需要认证，原则上都需认证
    permission_classes = ()
    authentication_classes = ()

    @action(detail=False, methods=["post"], interpretation='eiico升级结束后创建AMT任务')
    def set_amt_task(self, request):  # 2222
        logging.info("EIICO升级任务结束后，回调建AMT任务")
        print("key=%s" % request.GET.get("key"))
        key = request.GET.get("key")
        amt = TaskInfo.objects.get(key=key)
        ret = PublicOperation().get_update_result(amt.eiicoID)
        print("升级结果:%s" % ret)
        if ret == "SUCCESS":
            amt.statuhs = "upgrade_success"
            amt_data = {"author": amt.author, "name": amt.taskName, "case_cfg": amt.caseCfg,
                        "device_type": [amt.deviceType]}
            amt_data['case_cfg'] = eval(amt.caseCfg)  # 将数据库中读出来的str转成[]
            amt_data['key'] = key
            amt_data['VAR_BAIPAI_CODED_BRANCH'] = amt.codeBranch
            amt_data['VAR_WEB_CONTROLPATH'] = amt.controlPath
            amt_data['main_ip'] = amt.deviceIp
            send_data = PublicOperation().set_task_data(amt_data)
            ret, response = amt_client.create_amt_task(send_data)  # AMT建任务
            if ret:
                logging.info("AMT下发任务成功")
                amt.jobId = response['job_id']
                amt.status = "executing"
                res = PublicOperation().startAmtTask(amt_data['author'], response['job_id'])
                amt.resultId = res
                print("任务resultId:%s,type:%s" % (amt.resultId, type(amt.resultId)))
                logging.info("开始执行AMT任务")
                PublicOperation().add_caseinfo_sql(key, res)
            else:
                logging.info("AMT下发任务失败")
                amt.status = "taskerror"
                amt.taskStatus = 2

            amt.save()
        else:
            print("升级失败写数据库")
            amt.status = "upgrade_fail"
            amt.taskStatus = 2
            amt.save()
            print("已写完数据库")

        # except:
        #     logging.info("下发AMT任务失败")

    @action(detail=False, methods=["post"], interpretation='AMT执行完任务写入数据库')
    def add_result_sql(self, request):  # 3333
        logging.info("AMT任务执行结束后，回调将执行结果写入数据库")
        time.sleep(60*3.5)
        key = request.GET.get("key")
        print("写数据库key=%s" % request.GET.get("key"))
        amt = TaskInfo.objects.get(key=key)
        amt.status = "complete"
        amt.taskStatus = 2
        amt.save()

        res = PublicOperation().getTaskResult(amt.resultId)  # 获取AMT执行结果
        for case in res['general_result_detail'][0]['case_detail_result']:
            try:
                cause = case['analyse']['cause'][-1]
            except:
                cause = ""
            # amtResult.objects.create(
            #     jobId=case['task_id'],
            #     generalResult="",
            #     runTime=case['run_time'],
            #     caseId=case['key'],
            #     tcid=case['tcid'],
            #     name=case['name'],
            #     testBed=case['env_info']['test_bed'],
            #     model=case['env_info']['model'],
            #     testIp=case['env_info']['main_ip'],
            #     version=case['env_info']['version'],
            #     result=case['result'],
            #     failMsg=case['fail_msg'],
            #     analyse=cause,
            #     key=key,
            #     motherTaskSeq=amt.motherTaskSeq
            # )
            caseinfo = amtResult.objects.get(name=case['name'], jobId=amt.resultId)
            caseinfo.generalResult = ""
            caseinfo.runTime = case['run_time']
            caseinfo.caseId = case['key']
            caseinfo.testBed = case['env_info']['test_bed']
            caseinfo.version = case['env_info']['version']
            caseinfo.result = case['result']
            caseinfo.failMsg = case['fail_msg']
            caseinfo.analyse = cause
            caseinfo.save()
            if caseinfo.costTime is None:        # 定时任务没获取到的，通过回调接口将结果写进去
                # 以下为获取日志和图片路径并保存到数据库中
                logging.info("开始获取图片和日志")
                r1 = amtResult.objects.get(caseId=case['key'], jobId=amt.resultId)
                ImageHttp = BasisInfo.objects.get(key="ImageHttp")
                log_path = amt_client.get_case_log_path(case['key'])
                loginfo, file_list, path1 = PublicOperation().getPicPath(log_path['run_log'], ImageHttp.values)
                video_list = []
                pic_list = []
                for i in file_list:
                    if str(i).endswith('.mp4'):
                        video_list.append(i)
                    elif str(i).endswith('.jpg') or str(i).endswith('.png'):
                        pic_list.append(i)
                r1.imageUrl = pic_list
                r1.videoUrl = video_list
                r1.logInfo = loginfo
                r1.Originalpath = path1 + "/" + r1.testIp
                r1.save()

        logging.info("将执行结果写入数据库中")
        return "OK"

    @action(detail=False, methods=['GET'], interpretation='对接AMT查询任务详情')
    def get_task_record(self, request):
        task_id = request.GET.get('key')
        response = amt_client.get_task_record(task_id)
        return response
