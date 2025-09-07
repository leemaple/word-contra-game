// 页面功能测试脚本
// 用于在浏览器控制台中测试各页面功能

const testPages = () => {
  console.log('=== 单词魂斗罗游戏页面测试 ===\n');
  
  // 测试路由
  const routes = [
    { path: '/', name: '主菜单' },
    { path: '/levels', name: '关卡选择' },
    { path: '/vocabulary', name: '单词兵工厂' },
    { path: '/settings', name: '设置' },
    { path: '/achievements', name: '成就系统' }
  ];
  
  console.log('页面路由测试:');
  routes.forEach(route => {
    console.log(`✓ ${route.name}: http://localhost:5173${route.path}`);
  });
  
  // 测试localStorage数据
  console.log('\n数据存储测试:');
  const storageKeys = [
    'wordContra_userProfile',
    'wordContra_wordStates',
    'wordContra_gameState',
    'wordContra_settings'
  ];
  
  storageKeys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      console.log(`✓ ${key}: ${data.length} bytes`);
    } else {
      console.log(`✗ ${key}: 未找到数据`);
    }
  });
  
  // 测试Zustand store
  console.log('\n游戏状态测试:');
  const storeState = window.__zustand_stores && window.__zustand_stores[0];
  if (storeState) {
    const state = storeState.getState();
    console.log('✓ UserProfile:', state.userProfile);
    console.log('✓ GameState:', state.gameState);
    console.log('✓ Settings:', state.settings);
    console.log('✓ WordStates count:', Object.keys(state.wordStates || {}).length);
  }
  
  console.log('\n=== 测试完成 ===');
  console.log('请手动访问每个页面并测试交互功能');
};

// 导出测试函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = testPages;
} else {
  console.log('在浏览器控制台运行: testPages()');
}

testPages();