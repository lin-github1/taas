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
from django.http import Http404
from rest_framework import viewsets

from whiteBox.utils.decorators import api_action as action
from whiteBox.utils.public import PublicOperation


class StatusViewSet(viewsets.ViewSet):
    """
        Demo 获取数据
    """
    # 以下参数会取消该类中的接口认证，正式环境需要考虑接口是否需要认证，原则上都需认证
    permission_classes = ()
    authentication_classes = ()

    def list(self, request):
        # 此方法只是为了Router能载入ExeViewSet的页面入口，无实际用途
        raise Http404




