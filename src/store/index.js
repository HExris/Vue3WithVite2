import { createStore } from 'vuex'
import mutations from './mutations'
import state from './state'
import actions from './actions'

export default createStore({
    state,
    mutations,
    actions
})