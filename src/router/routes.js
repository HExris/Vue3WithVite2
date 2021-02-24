import Layout from 'view/Layout.vue'
import HelloWorld  from 'comp/HelloWorld.vue'

const routes = [{
    path: '/',
    component: Layout,
    redirect: 'HelloWorld',
    children: [
        {
            path: 'HelloWorld',
            component: HelloWorld
        }
    ]
} ]

export default routes