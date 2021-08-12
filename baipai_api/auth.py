# -*- coding: utf-8 -*-
"""
-------------------------------------------------------------------------------
@author  :sdc_os
@time    :2020/02/10
@file    :auth.py
@desc    :用户认证以及用户信息相关接口
@license :(c) Copyright 2020, SDC.
-------------------------------------------------------------------------------
"""
from datetime import datetime, timedelta
from django.contrib.auth.models import User
from django.core.cache import cache
from rest_framework.response import Response
from rest_framework import viewsets

from whiteBox.utils.sdc_carrier_client import sdc_carrier_client
from whiteBox.models import AuthToken
from whiteBox.utils import exceptions
from whiteBox.utils.decorators import api_action as action


class TokenViewSet(viewsets.ViewSet):
    """
        密钥Token
    """
    authentication_classes = ()
    permission_classes = ()

    @staticmethod
    def _process_user_info(user_info):
        if not user_info:
            return None
        _data = dict(
           department=user_info.get('department'),
            username=user_info.get('username'),
            # address=user_info.get('address'),
            avatar=user_info.get('avatar'),
            category=user_info.get('category'),
            # is_manager=user_info.get('is_manager'),
            is_active=user_info.get('is_active') or False,
            first_name=user_info.get('first_name'),
            email=user_info.get('email'),
            synced=datetime.now(),
            short_name=user_info.get('short_name'),
            sex=user_info.get('sex'),
        )
        user = None

        try:
            user = User.objects.get(username=user_info.get('username'))
            for k, v in _data.items():
                if hasattr(user, k):
                    setattr(user, k, v)
            user.save()
        except User.DoesNotExist:
            # 如果用户不存在，即创建一个用户

            try:
                user = User(
                  **_data
                )
                user.save()
            except Exception as e:
                print(e)
        except Exception as e:
            print(e)
            raise e
        finally:
            return user

    @action(detail=False, methods=['GET'], interpretation='获取app应用访问令牌成功')
    def get_token(self, request):
        """
        获取app应用访问令牌接口
        :param request:
            ticket: 用户验证ticket
        :return:
            {
            'code': 200,
            'msg': '获取资源访问令牌',
            'data': '令牌数据'
        }
        """

        # 获取用户信息
        user_data = sdc_carrier_client.verify_user_ticket(request.GET.get('ticket'))
        user = self._process_user_info(user_data)
        if user and user.is_active:
            try:
                token = AuthToken.objects.get(user=user)
                if token.expires < datetime.now() or token.started > datetime.now():
                    if cache.has_key(token.key):
                        cache.delete(token.key)
                    token.delete()
                    token = AuthToken(user=user)
            except AuthToken.DoesNotExist:
                token = AuthToken(user=user)
            except:
                token = None
            if token is not None:
                if user.category == '0':
                    token.expires = datetime.now() + timedelta(hours=12)
                elif user.category == '1':
                    token.expires = datetime.now() + timedelta(days=15)
                else:
                    token.expires = datetime.now()
                token.save()
                cache.set(token.key, user, 30 * 60)
                return token.key
        elif user and not user.is_active:
            AuthToken.objects.filter(user=user).delete()
            raise exceptions.UserNotActive()
        else:
            raise exceptions.TicketNotValid()


class UserViewSet(viewsets.ViewSet):
    """
        Demo 获取数据
    """
    @action(detail=False, methods=['GET'], interpretation='获取用户身份信息')
    def get_user_info(self, request):
        return User.objects.filter(username=request.user.username).values(
            'email', 'username', 'first_name', 'avatar',
            'category', 'department', 'is_active', 'id', 'is_superuser',
            "sex", "short_name"
        )[0]


class DemoViewSet(viewsets.ViewSet):
    """
        Demo 获取数据
    """
    @action(detail=False, methods=['GET'])
    def hello_world(self, request):
        res = {
            "code": 200,
            "msg": 'hello world demo',
            "data": ''
        }
        return Response(res, status=res["code"])


