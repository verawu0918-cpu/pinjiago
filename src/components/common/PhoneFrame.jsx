import './PhoneFrame.css'

export default function PhoneFrame({ children }) {
  return (
    <div className="stage">
      <div className="left-info">
        <h1>拼假Go</h1>
        <div className="en">PINJIA GO</div>
        <div className="slogan">
          用最少的假，去最远的远方，<br/>遇见最对的人。
        </div>
        <ul className="feature-list">
          <li><b>AI 拼假神器</b>遍历全年法定假日，一键算出最优拼假方案</li>
          <li><b>智能行程规划</b>输入目的地 × 天数 × 风格，AI 生成逐日行程</li>
          <li><b>旅行搭子匹配</b>四维算法推荐同频搭子，行程重合自动组队</li>
        </ul>
      </div>

      <div className="phone">
        <div className="screen">
          {children}
        </div>
      </div>

      <div className="right-info">
        <h3>产品亮点</h3>
        <div className="stat-pill">
          <div className="v">35</div>
          <div className="l">源码文件数</div>
        </div>
        <div className="stat-pill">
          <div className="v">~2900</div>
          <div className="l">代码行数</div>
        </div>
        <div className="stat-pill">
          <div className="v">7</div>
          <div className="l">完整页面</div>
        </div>
        <div className="stat-pill">
          <div className="v">4.33</div>
          <div className="l">最高性价比</div>
        </div>
      </div>
    </div>
  )
}
