import request from "umi-request";

export const sdc_sum = (...arr) => [].concat(...arr).reduce((acc, val) => acc + val, 0);

export function updateTreeData(list, key, children) {
  return list.map(node => {
    if (node.key === key) {
      return {...node, children};
    }
    if (node.children) {
      return {...node, children: updateTreeData(node.children, key, children)};
    }

    return node;
  });
}

export const CauseOptions = [
  {
    "id": "其他问题",
    "title": "其他问题",
    "items": [
      {
        "id": "用例不在配置的范围中",
        "title": "用例不在配置的范围中"
      },
      {
        "id": "因多态策略计算后无需执行（不在测试范围的用例）",
        "title": "因多态策略计算后无需执行（不在测试范围的用例）"
      },
      {
        "id": "任务被终止",
        "title": "任务被终止"
      },
      {
        "id": "任务运行错误",
        "title": "任务运行错误"
      },
      {
        "id": "其他问题",
        "title": "其他问题"
      }
    ]
  },
  {
    "id": "工具问题",
    "title": "工具问题",
    "items": [
      {
        "id": "AGENT工具问题",
        "title": "AGENT工具问题"
      },
      {
        "id": "EiiCo工具问题",
        "title": "EiiCo工具问题"
      },
      {
        "id": "ITC工具问题",
        "title": "ITC工具问题"
      },
      {
        "id": "公司基础工具问题",
        "title": "公司基础工具问题"
      },
      {
        "id": "其他工具问题",
        "title": "其他工具问题"
      },
      {
        "id": "多态策略问题",
        "title": "多态策略问题"
      },
      {
        "id": "等待主机超时，未执行",
        "title": "等待主机超时，未执行"
      },
      {
        "id": "其他原因，未执行",
        "title": "其他原因，未执行"
      }
    ]
  },
  {
    "id": "版本变更",
    "title": "版本变更",
    "items": [
      {
        "id": "版本变更",
        "title": "版本变更"
      }
    ]
  },
  {
    "id": "版本问题",
    "title": "版本问题",
    "items": [
      {
        "id": "版本问题_已知",
        "title": "版本问题_已知"
      },
      {
        "id": "版本问题_新增",
        "title": "版本问题_新增"
      }
    ]
  },
  {
    "id": "环境问题",
    "title": "环境问题",
    "items": [
      {
        "id": "等待设备超时，未执行",
        "title": "等待设备超时，未执行"
      },
      {
        "id": "EiiCo系统异常",
        "title": "EiiCo系统异常"
      },
      {
        "id": "脚本需要的环境组网未建设",
        "title": "脚本需要的环境组网未建设"
      },
      {
        "id": "脚本需要的环境异常",
        "title": "脚本需要的环境异常"
      },
      {
        "id": "环境被其他用户占用，申请失败",
        "title": "环境被其他用户占用，申请失败"
      },
      {
        "id": "被测环境组网失败，1拖N失败（EiiCo服务）",
        "title": "被测环境组网失败，1拖N失败（EiiCo服务）"
      },
      {
        "id": "被测环境状态异常，SDK登录失败",
        "title": "被测环境状态异常，SDK登录失败"
      }
    ]
  },
  {
    "id": "用例问题",
    "title": "用例问题",
    "items": [
      {
        "id": "TMSS没有获取到该用例的多态配置",
        "title": "TMSS没有获取到该用例的多态配置"
      }
    ]
  },
  {
    "id": "脚本问题",
    "title": "脚本问题",
    "items": [
      {
        "id": "没有符合条件的主机",
        "title": "没有符合条件的主机"
      },
      {
        "id": "工程目录无法查到脚本",
        "title": "工程目录无法查到脚本"
      },
      {
        "id": "其他脚本问题",
        "title": "其他脚本问题"
      },
      {
        "id": "实现与用例不一致",
        "title": "实现与用例不一致"
      },
      {
        "id": "稳定性差",
        "title": "稳定性差"
      },
      {
        "id": "编程实现错误",
        "title": "编程实现错误"
      },
      {
        "id": "脚本检查点错误",
        "title": "脚本检查点错误"
      },
      {
        "id": "配置残留",
        "title": "配置残留"
      }
    ]
  },
  {
    "id": "自动化工程问题",
    "title": "自动化工程问题",
    "items": [
      {
        "id": "公共AW问题，SDK接口，未知错误码",
        "title": "公共AW问题，SDK接口，未知错误码"
      },
      {
        "id": "EiiCo安装环境失败，Http Error",
        "title": "EiiCo安装环境失败，Http Error"
      },
      {
        "id": "EiiCo安装环境失败，安装超时",
        "title": "EiiCo安装环境失败，安装超时"
      },
      {
        "id": "从EiiCo获取设备型号和算法包安装配套关系失败，Http Error",
        "title": "从EiiCo获取设备型号和算法包安装配套关系失败，Http Error"
      },
      {
        "id": "公共fixture失败",
        "title": "公共fixture失败"
      }
    ]
  }
];

export const getCauseOptions = ()=> {
  let _t = [];
  request.get("http://10.244.179.0:51010/prod/conf/cause.json")
    .then((res)=>_t=res.json())
    .catch(()=>_t=CauseOptions)
  return _t
};
