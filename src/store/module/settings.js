import defaultSettings from '@/default-settings'
const { title, tagsView, fixedHeader, sidebarLogo, uniqueOpened, showFooter, footerTxt, caseNumber } = defaultSettings

const state = {
  title: title,
  footerTxt: '<a style="color: #bfb8b8" target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=42070302000092">鄂公网安备 42070302000092号</a>\n' +
      '    &nbsp;\n' +
      '    <a style="color: #bfb8b8" href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">鄂ICP备2022003078号-1</a>'
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

