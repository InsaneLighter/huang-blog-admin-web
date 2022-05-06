import {getCurrentUser} from "@/api/user";

const state = {
  info: {}
}

const mutations = {
  SET_USER: (state,user) => {
    state.info = user
  }
}

const actions = {
  setUser({ commit },user) {
    commit('SET_USER',user)
  },
  GetInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getCurrentUser().then(res => {
        commit('SET_USER', res.data.user)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
