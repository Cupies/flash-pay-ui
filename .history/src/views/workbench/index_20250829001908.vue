<template>
  <div class="work-container">
    <div class="bg">
        <div class="personalInfo">
            <img src="../../../public/img/head.png" alt="用户头像" class="avatar">
            <div class="info-content">
                <p class="user-name">你好，{{username}}</p>
                <p class="user-mobile">账号: {{mobile}}</p>
                <div class="service-expire">
                    <span class="expire-time">服务到期时间:2025.12.30</span>
                    <button class="btn-renew">续费</button>
                    <button class="btn-upgrade">升级</button>
                </div>
            </div>
        </div>
    </div>
    <div class="content">
        <!-- 交易数据模块 -->
        <div class="deal-card">
            <div class="deal-header">
                <div class="tab-group">
                    <span class="tab-item active">本日交易数据</span>
                    <span class="tab-item">昨日交易数据</span>
                </div>
                <div class="operation-group">
                    <span class="oper-item more-btn">
                        <img src="../../../public/img/more.png" alt="更多">更多
                    </span>
                    <span class="oper-item refresh-btn">
                        <img src="../../../public/img/circle.png" alt="刷新">更新
                    </span>
                </div>
            </div>
            <!-- 数据表格 -->
            <div class="data-table">
                <ul class="table-header">
                    <li></li>
                    <li>成功交易金额</li>
                    <li>成功交易笔数</li>
                    <li>转换率</li>
                    <li>退款笔数</li>
                    <li>手续费</li>
                </ul>
                <ul class="table-row receive-data">
                    <li class="row-title">收款数据</li>
                    <li class="data-value">7,288.00</li>
                    <li class="data-value">2,134</li>
                    <li class="data-value">13%</li>
                    <li class="data-value">2</li>
                    <li class="data-value">123.00</li>
                </ul>
                <ul class="table-row payment-data">
                    <li class="row-title">打款业务数据</li>
                    <li class="data-value">0.00</li>
                    <li class="data-value">0.00</li>
                    <li class="data-value">0.00</li>
                    <li class="data-value">—</li>
                    <li class="data-value">—</li>
                </ul>
            </div>
        </div>

        <!-- 功能模块列表 -->
        <div class="module-list">
            <div class="detail lefts">
                <p class="module-title">基础模块</p>
                <div class="modules">
                    <div class="module-item" @click="goPay">
                        <img src="../../../public/img/list_1.png" alt="支付应用系统">
                        <p>支付应用系统</p>
                    </div>
                    <div class="module-item">
                        <img src="../../../public/img/list_2.png" alt="渠道待申请">
                        <p>渠道待申请</p>
                    </div>
                    <div class="module-item">
                        <img src="../../../public/img/list_3.png" alt="更多">
                        <p>更多</p>
                    </div>
                </div>
            </div>
            <div class="detail">
                <p class="module-title">高级模块</p>
                <div class="modules">
                    <div class="module-item">
                        <img src="../../../public/img/list_1.png" alt="CEO看板">
                        <p>CEO看板</p>
                    </div>
                    <div class="module-item">
                        <img src="../../../public/img/list_2.png" alt="用户系统">
                        <p>用户系统</p>
                    </div>
                    <div class="module-item">
                        <img src="../../../public/img/list_3.png" alt="更多">
                        <p>更多</p>
                    </div>
                </div>
            </div>
            <div class="detail lefts">
                <p class="module-title">支付场景</p>
                <div class="modules">
                    <div class="module-item">
                        <img src="../../../public/img/list_1.png" alt="跨境收款">
                        <p>跨境收款</p>
                    </div>
                    <div class="module-item">
                        <img src="../../../public/img/list_2.png" alt="企业打款">
                        <p>企业打款</p>
                    </div>
                    <div class="module-item">
                        <img src="../../../public/img/list_3.png" alt="更多">
                        <p>更多</p>
                    </div>
                </div>
            </div>
            <div class="detail">
                <p class="module-title">账户相关</p>
                <div class="modules">
                    <div class="module-item">
                        <img src="../../../public/img/list_1.png" alt="财务中心">
                        <p>财务中心</p>
                    </div>
                    <div class="module-item">
                        <img src="../../../public/img/list_2.png" alt="账户中心">
                        <p>账户中心</p>
                    </div>
                    <div class="module-item">
                        <img src="../../../public/img/list_3.png" alt="更多">
                        <p>更多</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getList } from '@/api/finance'; // 移除 .ts 扩展名

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const username = ref('');
    const mobile = ref('');
    const list = ref({});

    // 初始化数据
    onMounted(() => {
      getLists();
      username.value = localStorage.getItem('username') || '';
      mobile.value = localStorage.getItem('mobile') || '';
    });

    // 支付跳转逻辑
    const goPay = () => {
      if (list.value.auditStatus === '0') {
        router.push('/finance/approve');
      } else {
        router.push('/finance/index');
      }
    };

    // 获取列表数据
    const getLists = async () => {
      list.value = await getList();
      console.log(list.value);
    };

    return {
      username,
      mobile,
      list,
      goPay
    };
  }
};
</script>

<style lang="scss">
// 基础全局样式重置
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

html, body {
    width: 100%;
    height: 100%;
    background: rgba(245, 247, 250, 1);
}

// 主容器样式
.work-container {
    width: 100%;
    min-height: 100vh;
    background: rgba(245, 247, 250, 1);

    // 顶部背景区域
    .bg {
        width: 100%;
        height: 289px;
        background: #212121 url('../../../public/img/bg.png') no-repeat center center;
        background-size: cover; // 保证背景图全屏覆盖
        overflow: hidden;
        position: relative;
        z-index: 1; 

        // 个人信息卡片
        .personalInfo {
            position: absolute;
            left: 50%;
            top: 100%;
            bottom: -50px;
            transform: translateX(-50%) translateY(-150px);
            width: 800px;
            height: auto;
            display: flex;
            align-items: center;
            gap: 31px; 
            background: rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            padding: 0 30px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            
            .avatar {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                border: 3px solid rgba(255, 255, 255, 0.3); // 增加头像边框，提升精致度
                object-fit: cover;
            }

            .info-content {
                color: #fffdfd !important;
                flex-grow: 1;

                .user-name {
                    color: #1d43ee !important;
                    font-size: 24px;
                    margin-bottom: 12px;
                    font-weight: 500;
                }

                .user-mobile {
                    color: #080808 !important;
                    font-size: 16px;
                    margin-bottom: 24px;
                    opacity: 0.8;
                }

                .service-expire {
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    gap: 20px;

                    .expire-time {
                        opacity: 0.6;
                    }

                    // 按钮样式统一化
                    .btn-renew, .btn-upgrade {
                        width: 80px;
                        height: 36px;
                        border-radius: 18px;
                        border: none;
                        color: white;
                        font-size: 14px;
                        cursor: pointer;
                        transition: all 0.3s ease; // 增加过渡动画
                    }

                    .btn-renew {
                        background: rgba(243, 41, 113, 1);
                    }

                    .btn-upgrade {
                        background: rgba(25, 137, 250, 1);
                    }

                    // 按钮hover效果
                    .btn-renew:hover {
                        background: rgba(243, 41, 113, 0.9);
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(243, 41, 113, 0.3);
                    }

                    .btn-upgrade:hover {
                        background: rgba(25, 137, 250, 0.9);
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(25, 137, 250, 0.3);
                    }
                }
            }
        }
    }

    // 中间内容区域
    .content {
        width: 1200px;
        margin: 0 auto;
        margin-top: 70px; // 向上偏移，与顶部背景形成重叠，增强层次感
        padding-bottom: 60px; // 底部留白，避免内容贴底
        z-index: 2;
        // 交易数据卡片
        .deal-card {
            width: 100%;
            height: 299px;
            background: white;
            border-radius: 12px; // 增加圆角，更现代
            padding: 30px 40px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05); // 增加轻微阴影，提升立体感
            margin-bottom: 24px;
            padding-top: 40px;
            // 头部标题栏
            .deal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;

                // 标签组
                .tab-group {
                    width: 234px;
                    height: 36px;
                    border-radius: 4px;
                    border: 1px solid rgba(228, 231, 237, 1);
                    display: flex;
                    overflow: hidden; // 隐藏圆角外边框

                    .tab-item {
                        flex: 1;
                        height: 100%;
                        background: rgba(240, 242, 245, 1);
                        text-align: center;
                        line-height: 36px;
                        font-size: 14px;
                        color: #666;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }

                    .tab-item.active {
                        color: rgba(25, 137, 250, 1);
                        background: white;
                        font-weight: 500;
                        box-shadow: inset 0 2px 0 rgba(25, 137, 250, 1); // 底部下划线标识选中
                    }

                    .tab-item:hover:not(.active) {
                        background: rgba(235, 238, 245, 1);
                    }
                }

                // 操作按钮组
                .operation-group {
                    display: flex;
                    gap: 40px; // 统一间距

                    .oper-item {
                        font-size: 14px;
                        color: rgba(25, 137, 250, 1);
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 6px; // 图标与文字间距
                        transition: color 0.3s ease;
                    }

                    .oper-item:hover {
                        color: rgba(18, 108, 201, 1);
                    }

                    .oper-item img {
                        width: 16px;
                        height: 16px;
                    }
                }
            }

            // 数据表格区域
            .data-table {
                width: 100%;

                .table-header, .table-row {
                    width: 100%;
                    height: 48px; // 增加行高，提升可读性
                    display: flex;
                    align-items: center;
                    padding: 0 10px;
                    border-bottom: 1px solid rgba(240, 242, 245, 1); // 统一分隔线
                }

                .table-header {
                    li {
                        flex: 1;
                        font-size: 14px;
                        color: #999;
                        list-style: none;
                        text-align: center;
                    }
                }

                .table-row {
                    li {
                        flex: 1;
                        font-size: 14px;
                        list-style: none;
                        text-align: center;
                    }

                    .row-title {
                        color: #333;
                        font-weight: 500;
                        text-align: left !important; // 标题左对齐
                        padding-left: 20px;
                    }

                    .data-value {
                        color: #333;
                        font-family: 'Poppins', sans-serif;
                    }

                    // 收款数据特殊颜色
                    &.receive-data .data-value {
                        color: rgba(255, 96, 96, 1);
                    }

                    // 打款数据颜色（区分无数据状态）
                    &.payment-data .data-value {
                        color: #999;
                    }

                    // 最后一行取消下边框
                    &:last-child {
                        border-bottom: none;
                    }
                }
            }
        }

        // 功能模块列表
        .module-list {
            width: 100%;
            display: flex;
            flex-wrap: wrap; // 自动换行，适配小屏幕
            gap: 22px; // 模块间距统一

            .detail {
                flex: 1;
                min-width: 589px; // 最小宽度，避免过窄
                margin-top: 0; // 取消原margin-top，用gap控制间距

                .module-title {
                    font-size: 18px;
                    color: #333;
                    margin-bottom: 12px;
                    font-weight: 500;
                }

                // 模块容器
                .modules {
                    width: 100%;
                    height: 194px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
                    display: flex;
                    overflow: hidden;

                    .module-item {
                        flex: 1;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        position: relative;

                        // 分隔线（最后一个模块取消）
                        &:not(:last-child)::after {
                            content: '';
                            position: absolute;
                            right: 0;
                            top: 20%;
                            height: 60%;
                            width: 1px;
                            background: rgba(228, 231, 237, 1);
                        }

                        img {
                            width: 48px;
                            height: 48px;
                            margin-bottom: 16px;
                            transition: transform 0.3s ease;
                        }

                        p {
                            font-size: 14px;
                            color: #333;
                            text-align: center;
                        }

                        // hover效果
                        &:hover {
                            background: rgba(245, 249, 255, 1);

                            img {
                                transform: scale(1.05); // 图标轻微放大
                            }

                            p {
                                color: rgba(25, 137, 250, 1);
                            }
                        }
                    }
                }
            }

            // 左侧模块间距（已用gap替代，此处保留兼容）
            .lefts {
                margin-right: 0;
            }
        }
    }
}

// 响应式适配（屏幕<1200px时）
@media (max-width: 1200px) {
    .work-container .content {
        width: 90%;
        padding: 0 20px;
        margin-top: 90px;
    }

    .work-container .bg .personalInfo {
        width: 90%;
        flex-direction: column;
        height: auto;
        text-align: center;
        bottom: -70px;
        top: 60%;
    }

    .module-list .detail {
        min-width: 100%; // 移动端单列显示
    }
}
</style>