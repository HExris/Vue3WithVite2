import { ElInput, ElButton, ElSelect, ElBreadcrumb, ElDialog } from 'element3'

export default function (app) {
    app.use(ElInput)
    app.use(ElButton)
    app.use(ElSelect)
    app.use(ElBreadcrumb)
    app.use(ElDialog)
}