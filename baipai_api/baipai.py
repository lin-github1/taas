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
from django.db.models import Q
from django.http import Http404
import json
import os
import sys
import logging
from requests import post
import uuid
from rest_framework import viewsets
from rest_framework.response import Response
from whiteBox.utils.exceptions import ParamsError
from whiteBox.utils.amt_client import amt_client
from whiteBox.utils.tras_client import tras_client
from whiteBox.utils.eiico_client import eiico_client
from whiteBox.utils.decorators import api_action as action
from whiteBox.task import create_new_task, create_new_taskV2
# from whiteBox.utils.amt_client import AMTClient
from whiteBox.utils.public import PublicOperation
from toolkit.tool_by_sdk.sdk_Common import ssh_sftp_enable
from whiteBox.models import TaskInfo, amtResult, Tmssinfo, BasisInfo, GeneralTaskInfo
from toolkit.tool_by_ssh.sdc_connect_by_ssh import linuxToWindows
from whiteBox.utils.ftp_client import FTPClient
import shutil,time

class operationSet(viewsets.ViewSet):
    """
        Demo 获取数据
    """
    # 以下参数会取消该类中的接口认证，正式环境需要考虑接口是否需要认证，原则上都需认证
    # permission_classes = ()
    # authentication_classes = ()

    @action(detail=False, methods=['GET'], interpretation='这是一个demo接口')
    def hello(self, request):
        return 'hello world'

    @action(detail=False, methods=['POST'], interpretation='这是一个demo接口')
    def hello(self, request):
        url = "http://itrust.api.rnd.huawei.com/mock/24/amt/api/runner/job/save_job_data/"
        data={}
        post(url, data)
        return 'hello world'

    @action(detail=False, methods=['POST'], interpretation='对接AMT下发任务')
    def creat_task(self, request):
        """
        "TaskType": //任务类型，1-白牌定制，2-款型定制，3-OQC
        "author": "", // 任务发起人
        "name":"",  // 任务名称
        "topo": // 环境解析模式：by_bed-->按测试床；by_env--> 按测试环境
        "device_type":  //设备款型   根据该参数去获取eiido测试床下的对应设备
        "script_no":"70",   // 执行版本号，需要和对应的设备对应上
        "upgrade":true,  // 是否升级
        "packet_mode":false, // 升级包的模式：true 表示自定义给升级包地址；false 表示按eiico的升级包ID
        "upgrade_reset":true/flse, // 是否升级后恢复默认
        "uninstall_app":true, // 是否卸载原有app和算法
        :param request:
        :return:
        """

        data = request.data
        send_data = PublicOperation().set_task_data(data)

        response = amt_client.create_amt_task(send_data)
        print(response)
        return response

    @action(detail=False, methods=['POST'], interpretation='对接AMT执行任务')
    def run_task(self, request):
        """
        :param request:
        :return:
        """
        # if request.data.get("author"):
        #     author = request.data.get("author")
        # else:
        #     raise ParamsError("author 不允许为空")
        send_data = request.data
        response = amt_client.run_case(send_data)
        print(response)
        return response

    @action(detail=False, methods=['POST'], interpretation='对接AMT停止任务')
    def stop_task(self, request):
        """
        :param request:
        :return:
        """
        if request.data.get("executor"):
            executor = request.data.get("executor")
        else:
            raise ParamsError("executor 不允许为空")
        send_data = request.data
        response = amt_client.stop_case(send_data)
        print(response)
        return response

    @action(detail=False, methods=['POST'], interpretation='对接AMT删除任务')
    def delete_task(self, request):
        """
        :param request:
        :return:
        """
        # if request.data.get("executor"):
        #     executor = request.data.get("executor")
        # else:
        #     raise ParamsError("executor 不允许为空")
        send_data = {"task_name": "20210311", "key": "228fef26-820f-11eb-b6bc-fa163e3ffbb5"}
        response = amt_client.delete_job(send_data)
        print(response)
        return response

    @action(detail=False, methods=['GET'], interpretation='对接AMT查询任务详情')
    def get_task_result(self, request):
        task_id = request.GET.get('task_id')
        response = amt_client.get_result(task_id)

        return response
    @action(detail=False, methods=['POST'], interpretation='前端查询总任务接口')
    def get_generaltask_result(self, request):
        json_data = request.data
        # print(json_data)
        _p = int(json_data.get('current', 0))
        _size = int(json_data.get('pageSize', 0))
        data = {
            "total": 0,
            "items": [],
            "current": _p,  # 当前页数
            "pageSize": _size,  # 总共的页数
        }

        # ***************上线放开注释*************************
        print(json_data)
        condition = Q(isDelete=False) & Q(author__icontains=json_data.get("author", ""))
        if json_data.get("taskName") and json_data.get("taskName") != "":
            condition = condition & Q(taskName__icontains=json_data.get("taskName"))
        if json_data.get("deviceType") and json_data.get("deviceType") != "":
            condition = condition & Q(deviceType__icontains=json_data.get("deviceType"))
        queryset = GeneralTaskInfo.objects.filter(condition).order_by('-create_time')
        data["total"] = queryset.count()
        print(queryset)
        if len(queryset[(_p - 1) * _size:_size * _p]) == 0:
            _p = 1
        for item in queryset[(_p - 1) * _size:_size * _p]:
            data["items"].append({
                "platFormSeq":item.platFormSeq,
                "taskName": item.taskName,
                "author": item.author,
                "TaskType": item.TaskType,
                "key": item.key,
                "create_time":item.create_time,
                "taskNum": item.taskNum,
                "deviceType": eval(item.deviceType),
                "caseNumber": item.caseNumber,
                "succeedNum": item.succeedNum,
                "failNum": item.failNum,
                "taskStatus": item.taskStatus,
                "upgradePacket": item.upgradePacket,
            })
        # print(data)
        return data
    @action(detail=False, methods=['GET'], interpretation='前端查询子任务接口')
    def get_task_result_num(self, request):
        print(request.GET)
        data = {
            "total": 0,
            "items": [],

        }

        # ***************上线放开注释*************************
        # json_data["author"] = request.user.short_name
        condition = ~Q(status='delete') & Q(motherTaskSeq=request.GET.get("pk"))
        queryset = TaskInfo.objects.filter(condition).order_by('-create_time')
        data["total"] = queryset.count()
        for item in queryset:
            data["items"].append({
                "key":item.key,
                "taskName": item.taskName,
                "jobId": item.jobId,
                "create_time": item.create_time,
                "deviceType": [item.deviceType],
                "deviceIp": [item.deviceIp],
                "status": item.status,
                "upgradePacket": item.upgradePacket,
            })
        print(data)
        return data

    @action(detail=False, methods=['POST'], interpretation='右击修改用例结果')
    def edit_case_result(self, request):
        json_data = request.data
        print(json_data)
        queryset = amtResult.objects.get(pk=json_data.get("pk"))
        queryset.result = json_data.get("caseResult")
        queryset.last_mender = request.user.short_name
        print(queryset.save())

        return 'OK'
    @action(detail=False, methods=['POST'], interpretation='查询用例执行结果接口')
    def get_case_result(self, request):
        json_data = request.data
        print(json_data)
        case_jobId = json_data.get("jobId")
        _p = int(json_data.get('current', 0))
        _size = int(json_data.get('pageSize', 0))
        data = {
            "total": 0,
            "items": [],
            "current": _p,  # 当前页数
            "pageSize": _size,  # 总共的页数
        }
        condition = Q(motherTaskSeq=json_data.get("motherTaskSeq"))
        if json_data.get("model") and json_data.get("model") != "all":
            condition = condition & Q(model__icontains=json_data.get("model"))
        queryset = amtResult.objects.filter(condition).order_by("model")
        data["total"] = queryset.count()
        print(data["total"])
        for item in queryset[(_p - 1) * _size:_size * _p]:
            if item.imageUrl != None and item.imageUrl != "" and item.imageUrl != "None":
                item.imageUrl=eval(item.imageUrl)
            else:
                item.imageUrl=[]
            if item.videoUrl != None and item.videoUrl != "" and item.videoUrl != "None":
                item.videoUrl=eval(item.videoUrl)
            else:
                item.videoUrl=[]
            data["items"].append({
                "generalResult": item.generalResult,
                "runTime": item.runTime,
                "key": item.key,
                "tcid": item.tcid,
                "name": item.name,
                "model": item.model,
                "testIp": item.testIp,
                "version": item.version,
                "result": item.result,
                "failMsg": item.failMsg,
                "analyse": item.analyse,
                "imageUrl":  item.imageUrl,
                "videoUrl": item.videoUrl,
                "motherTaskSeq":item.motherTaskSeq,
                "id":item.id,
                "logInfo":item.logInfo,
                "lastMender": item.last_mender
            })
        # print(data)
        return data

    @action(detail=False, methods=['GET'], interpretation='删除任务')
    def delete_case_info(self, request):
        json_data = request.data
        del_jobId = json_data.get("jobId")
        q = TaskInfo.objects.get(jobId=del_jobId)
        #上线释放此段代码
        # if q.author == request.user.short_name:
        q.status = "delete"
        q.save()
        return "Delete Success"


    @action(detail=False, methods=['GET'], interpretation='对接TRAS查询用例日志信息')
    def get_case_info(self, request):

        task_id = request.GET.get('Testcode', None)
        response = tras_client.get_test_info_list(task_id)

        return response
    @action(detail=False, methods=['POST'], interpretation='从eiico获取用户所有测试床信息')
    def get_test_bed_content(self, request):
        # user = request.GET.get('author', None)
        devicetype_list = PublicOperation().get_test_bed2(request.user.short_name, request.data.get("version"))
        return devicetype_list
    @action(detail=False, methods=['GET'], interpretation='从eiico获取用户所有版本信息')
    def get_version_list_content(self, request):
        # user = request.GET.get('author', None)
        devicetype_list = PublicOperation().get_version_list(request.user.short_name)
        return devicetype_list
    @action(detail=False, methods=['GET'], interpretation='从eiico根据测试床获取环境列表')
    def get_device_by_bed_content(self, request):
        # user = request.GET.get('author', None)
        bed_key = request.GET.get("key")
        data = PublicOperation().get_device_by_bed(bed_key)
        return {"total": len(data), "data": data}

    @action(detail=False, methods=['GET'], interpretation='根据用户获取设备型号列表')
    def get_devicetype_list(self, request):
        user = request.GET.get('author', None)
        devicetype_list = PublicOperation().get_device_info(user, 1)
        return devicetype_list

    @action(detail=False, methods=['GET'], interpretation='根据ID获取用例详情')
    def get_case_detail(self, request):
        case_id = request.GET.get('case_id', None)
        response = amt_client.execute_case_detail(case_id)

        return response

    @action(detail=False, methods=['GET'], interpretation='根据ID获取用例日志路径')
    def get_case_log_path(self, request):
        case_id = request.GET.get('case_id', None)
        response = amt_client.get_case_log_path(case_id)

        return response

    @action(detail=False, methods=['POST'], interpretation='对接Eiico设备升级')
    def set_device_update(self, request):
        send_data = request.data
        response = eiico_client.upgrade_env(send_data)
        print(response)
        return response

    @action(detail=False, methods=['GET'], interpretation='根据MsgID获取升级报告')
    def get_install_report(self, request):
        msg_id = request.GET.get('MsgID', None)
        response = eiico_client.get_install_report(msg_id)

        return response
    @action(detail=False, methods=["POST"], interpretation='对接前端下发总任务')
    def create_all_task(self, request):
        task_data = request.data    # 总任务信息
        task_data['upgrade_packet'] = task_data.get('upgradePacket', '')
        task_data['TaskType'] = task_data.get('TaskType', 1)  # 1-白牌，3-OQC
        task_data['case_number'] = []       # 用例类型
        task_data['case_number_manual'] = []       # 手工执行用例类型
        task_data['VAR_BAIPAI_CODED_BRANCH'] = task_data.get('VAR_BAIPAI_CODED_BRANCH', "")
        for num in task_data['caseNumber']:
            if num in ['OQC', 'whiteBox', 'AE', 'MVB', 'market', 'pic', 'dynamics', 'Scenario1', 'Scenario2', 'greenery', 'MVB']:
                tmss = Tmssinfo.objects.filter(farther_name=num).values("number", "autotype")
                for i in range(tmss.count()):
                    if tmss[i]['autotype'] == '1':
                        task_data['case_number'].append(tmss[i]['number'])
                    elif num in ['OQC', 'whiteBox']:
                        task_data['case_number_manual'].append(tmss[i]['number'])

        # #上线释放此段代码
        task_data['author'] = request.user.short_name
        print(request.user.short_name)
        motherTaskSeq = uuid.uuid1()
        GeneralTaskInfo.objects.create(
            platFormSeq=motherTaskSeq,
            taskName=task_data['taskName'],
            author=task_data['author'],
            TaskType=task_data['TaskType'],
            taskNum=len(task_data['deviceType']),
            caseNumber=task_data['case_number'],
            caseNumberManual=task_data['case_number_manual'],
            deviceType=task_data['deviceType'],
            upgradePacket=task_data['upgradePacket'],
            controlInstallMode=task_data['controlInstallMode'],
            upgradeMethod = task_data['upgradeMethod'],
            controlpath=task_data['controlpath'],
            mainIp=task_data['mainIp'],
            resConfig=task_data['resConfig'],
            caseNumbers=task_data['caseNumber']
        )

        case_cfg = []
        for case_number in task_data['case_number']:         # 赋值case_cfg
            a = {}
            a['case_uri'] = PublicOperation().getCadseUrl(case_number)
            a['case_tcid'] = case_number
            case_cfg.append(a)
        case_cfg_manual = []
        for case_number in task_data['case_number_manual']:         # 赋值case_cfg
            a = {}
            a['case_uri'] = PublicOperation().getCadseUrl(case_number)
            a['case_tcid'] = case_number
            case_cfg_manual.append(a)

        for i in range(len(task_data['deviceType'])):

            send_data = task_data.copy()
            send_data['case_cfg'] = case_cfg
            send_data['case_cfg_manual'] = case_cfg_manual
            send_data['motherTaskSeq'] = motherTaskSeq
            send_data['device_type'] = task_data['deviceType'][i]
            send_data['main_ip'] = task_data['mainIp'][i]
            send_data['name'] = task_data['taskName'] + "_00" + str(i)
            if send_data['upgrade_packet'] != '':
                send_data['upgrade_packet'] = task_data['upgrade_packet'][i]
            if task_data['controlInstallMode'] == 2:
                send_data['VAR_WEB_CONTROLPATH'] = task_data['controlpath'][i]
            if task_data['controlInstallMode'] == 1:
                result = ssh_sftp_enable(send_data['main_ip'])
                logging.info("打开%s的SSH和SFTP返回%s" % (send_data['main_ip'], str(result[0])))
            print("send_data:%s" % str(send_data))
            create_new_task.delay(send_data)
        return 'OK'

    @action(detail=False, methods=["POST"], interpretation='对接前端下发总任务,只新建任务，不升级')
    def create_all_taskV2(self, request):
        task_data = request.data    # 总任务信息
        task_data['upgrade_packet'] = task_data.get('upgradePacket', '')
        task_data['TaskType'] = task_data.get('TaskType', 1)  # 1-白牌，3-OQC
        task_data['case_number'] = []       # 用例类型
        task_data['case_number_manual'] = []       # 手工执行用例类型
        task_data['VAR_BAIPAI_CODED_BRANCH'] = task_data.get('VAR_BAIPAI_CODED_BRANCH', "")
        for num in task_data['caseNumber']:
            if num in ['OQC', 'whiteBox']:
                tmss = Tmssinfo.objects.filter(farther_name=num).values("number", "autotype")
                for i in range(tmss.count()):
                    if tmss[i]['autotype'] == '1':
                        task_data['case_number'].append(tmss[i]['number'])
                    elif num in ['OQC', 'whiteBox']:
                        task_data['case_number_manual'].append(tmss[i]['number'])

        # #上线释放此段代码
        task_data['author'] = request.user.short_name
        print(request.user.short_name)
        motherTaskSeq = uuid.uuid1()
        GeneralTaskInfo.objects.create(
            platFormSeq=motherTaskSeq,
            taskName=task_data['taskName'],
            author=task_data['author'],
            TaskType=task_data['TaskType'],
            taskNum=len(task_data['deviceType']),
            caseNumber=task_data['case_number'],
            caseNumberManual=task_data['case_number_manual'],
            deviceType=task_data['deviceType'],
            upgradePacket=task_data['upgradePacket'],
            caseNumbers=task_data['caseNumber'],
            taskStatus=3,
            controlInstallMode=task_data['controlInstallMode'],
            upgradeMethod=task_data['upgradeMethod'],
            controlpath=task_data['controlpath'],
            mainIp=task_data['mainIp'],
            resConfig=task_data['resConfig'],
        )

        case_cfg = []
        print(task_data['case_number'])
        for case_number in task_data['case_number']:         # 赋值case_cfg
            a = {}
            a['case_uri'] = PublicOperation().getCadseUrl(case_number)
            a['case_tcid'] = case_number
            case_cfg.append(a)
        case_cfg_manual = []
        for case_number in task_data['case_number_manual']:         # 赋值case_cfg
            a = {}
            a['case_uri'] = PublicOperation().getCadseUrl(case_number)
            a['case_tcid'] = case_number
            case_cfg_manual.append(a)

        for i in range(len(task_data['deviceType'])):

            send_data = task_data.copy()
            send_data['case_cfg'] = case_cfg
            send_data['case_cfg_manual'] = case_cfg_manual
            send_data['motherTaskSeq'] = motherTaskSeq
            send_data['device_type'] = task_data['deviceType'][i]
            send_data['main_ip'] = task_data['mainIp'][i]
            send_data['name'] = task_data['taskName'] + "_00" + str(i)
            if send_data['upgrade_packet'] != '':
                send_data['upgrade_packet'] = task_data['upgrade_packet'][i]
            if task_data['controlInstallMode'] == 2:
                send_data['VAR_WEB_CONTROLPATH'] = task_data['controlpath'][i]
            if task_data['controlInstallMode'] == 1:
                result = ssh_sftp_enable(send_data['main_ip'])
                logging.info("打开%s的SSH和SFTP返回%s" % (send_data['main_ip'], str(result[0])))
            print("send_data:%s" % str(send_data))
            create_new_taskV2.delay(send_data)
        return 'OK'

    @action(detail=False, methods=["get"], interpretation='前端查询CIDA用例')
    def get_tmss_info(self, request):
        data = request.data
        queryset = data.get("key")
        if queryset == "OQC":
            obj = Tmssinfo.objects.filter(farther_name=queryset).values("url", "name", "number", "autotype", "farther_name", "farther_uri")
        elif queryset == "whiteBox":
            obj = Tmssinfo.objects.filter(farther_name=queryset).values("url", "name", "number", "autotype", "farther_name", "farther_uri")
        return obj

    @action(detail=False, methods=["get"], interpretation='修改用例结果')
    def modified_result_info(self, request):
        try:
            data = request.data
            result = data.get("result")
            tcid = data.get("tcid")
            obj = amtResult.objects.get(tcid=tcid)
            obj.result = result
            obj.save()
            return "Modified Success"
        except Exception as e:
            return e

    @action(detail=False, methods=["get"], interpretation='修改用例结果')
    def modified_result_infos(self, request):
        key = request.GET.get("key")
        print("写数据库key=%s" % request.GET.get("key"))
        amt = TaskInfo.objects.get(key=key)
        res = PublicOperation().getTaskResult(amt.resultId)
        return res["progress"]

    @action(detail=False, methods=['GET'], interpretation='刷新CIDA用例')
    def gettmssinfo(self, request):
        rest_list = ["OQC", "whiteBox", "AE", "MVB", "market", "pic", "dynamics", "Scenario1", "Scenario2", "greenery"]
        # data = request.data
        # queryset = data.get("taskType")
        for queryset in rest_list:
            obj = BasisInfo.objects.get(key=queryset)
            uri = obj.values
            key = obj.key
            a = PublicOperation().getTmssInfo(uri, key)
        return a


    @action(detail=False, methods=['POST'], interpretation='对接MCTC执行任务')
    def run_mctc_task(self, request):
        """
        :param request:
        :return:
        """
        send_data = request.data
        send_data['author'] = request.user.short_name
        if send_data['child_mission'] is True:
            task = TaskInfo.objects.get(key=send_data['run_id'])
            send_data['key'] = str(task.jobId)
            try:
                send_data['key'] = str(task.jobId)
                key = str(task.key)

                if task.controlInstallMode == 1:
                    PublicOperation().installControl(key, task.deviceIp)        # 安装控件
                    # task.controlPath = "\\\\10.247.175.149\\sdcControl\\%s" % key
                    # task.save()
                response = amt_client.run_case(send_data)
                task.status = "executing"
                task.taskStatus = 1
                task.resultId = str(response)
                logging.info("执行任务成功")
                PublicOperation().add_caseinfo_sql(task.key, response)
            except Exception as e:
                logging.info("执行任务失败:%s" % str(e))
                task.status = "taskerror"
                task.taskStatus = 2
            task.save()
            generaltask = GeneralTaskInfo.objects.get(platFormSeq=task.motherTaskSeq)
        else:
            tasks = TaskInfo.objects.filter(motherTaskSeq=send_data['run_id'])
            for task in tasks:
                send_data['key'] = str(task.jobId)
                key = str(task.key)
                try:
                    if task.controlInstallMode == 1:
                        PublicOperation().installControl(key, task.deviceIp)        # 安装控件
                        # task.controlPath = "\\\\10.247.175.149\\sdcControl\\%s" % key
                        # task.save()
                    response = amt_client.run_case(send_data)
                    task.status = "executing"
                    task.resultId = str(response)
                    task.taskStatus = 1
                    logging.info("执行任务成功")
                    PublicOperation().add_caseinfo_sql(task.key, response)
                except Exception as e:
                    logging.info("执行任务失败:%s" % str(e))
                    task.status = "taskerror"
                    task.taskStatus = 2
                task.save()
            generaltask = GeneralTaskInfo.objects.get(platFormSeq=send_data['run_id'])
        generaltask.taskStatus = 1
        generaltask.save()

        return "OK"

    @action(detail=False, methods=['POST'], interpretation='下载docx文件')
    def downDocex(self, request):
        print(request.data)
        print(request.META["HTTP_HOST"])
        downPlatFormSeq = request.data["downPlatFormSeq"]

        obj_AMT = amtResult.objects.filter(key=downPlatFormSeq).values("name", "testBed", "model", "testIp", "version", "result",
                                                             "failMsg", "imageUrl", "videoUrl", "tcid")
        if len(obj_AMT) != 0:
            down_url, docx_name = PublicOperation().docx(obj_AMT, downPlatFormSeq)
            down_url = 'http://%s/static/docxs/%s' % (request.META["HTTP_HOST"], docx_name)
        else:
            down_url = "None"

        return down_url
