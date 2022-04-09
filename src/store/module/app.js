const state = {
  sidebar: {
    open: false
  },
  theme: 'light'
}

const mutations = {
  TOGGLE_SIDEBAR: (state) => {
    state.sidebar.open = !state.sidebar.open
  }
}

const actions = {
  ToggleSidebar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
