import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'

import Message1 from '../views/Student/PersonalInformation/Message.vue'
import Message2 from '../views/Student/PersonalInformation/LnformationPage.vue'
import Message3 from '../views/Student/PersonalInformation/aa.vue'
import practice from '../views/Student/IndividualInternship.vue'
import Employ from '../views/Student/EmploymentInformation.vue'
import Monthly from '../views/Student/Monthly/Monthly.vue'
import Fortnightly from '../views/Student/Monthly/Fortnightly.vue'
import UserManage from '@/views/UserManage.vue'
import TeacherManage from '@/views/TeacherManage.vue'
import CompanyManage from '@/views/CompanyManage.vue'
import PostApplication from '@/views/PostApplicationView.vue'
import postAudit from '@/views/postAudit.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/main',
    component: Main,
    children: [
      { path: 'operations', name: '1', component: () => import('../views/index.vue') },
      { path: 'classManagement', name: '5-1', component: () => import('../views/classManagement.vue') },
      { path: 'stuData', name: '2-1', component: () => import('../views/stuData.vue') },
      { path: 'shiXiData', name: '2-2', component: () => import('../views/shiXiData.vue') },
      { path: 'jiuYeData', name: '2-2-2', component: () => import('../views/jiuYeData.vue') },
      { path: 'studentManagement', name: '1', component: () => import('../views/studentManagement.vue') },
      {
        path: 'shiXiAndJiuYe', name: '1', component: () => import('../views/shiXiAndJiuYe.vue'),
        children: [
          { path: 'shiXiView', name: '1', component: () => import('../views/shiXiView.vue') },
          { path: 'jiuYeView', name: '1', component: () => import('../views/jiuYeView.vue') },
        ]
      },
      {
        path: 'personalCenter', component: () => import('../views/personalCenter.vue'),
        children: [
          {
            path: 'personalInformation', name: '6', component: () => import('../views/personalInformation.vue')
          },
          {
            path: 'updatePassword', name: '2', component: () => import('../views/updatePassword.vue')
          }
        ]
      },
      {
        path: 'Fortnightly', name: '1', component: () => import('../views/Fortnightly.vue')
      },
      {
        path: 'Monthly', name: '1', component: () => import('../views/Monthly.vue')
      },
      {
        path: 'UserManage',

        component: UserManage
      },
      {
        path: 'TeacherManage',

        component: TeacherManage
      },
      {
        path: 'CompanyManage',

        component: CompanyManage
      },
      {
        path: 'postAudit',

        component: postAudit
      },
      {
        path: 'PostApplication',

        component: PostApplication
      }
    ]
  },


  {
    path: '/teacher',
    name: 'teacher',
    component: () => import('../views/Teacher/TeacherIndexView.vue'),
    children: [
      { path: 'teaStudent', name: '1', component: () => import('../views/Teacher/AdministrationStudentView.vue') },
      {
        path: 'Monthly', name: '1', component: () => import('../views/Teacher/Monthly.vue')
      },
      {
        path: 'personalCenter', component: () => import('../views/personalCenter.vue'),
        children: [
          {
            path: 'personalInformation', name: '6', component: () => import('../views/Teacher/TeacherHomeView.vue')
          },
          {
            path: 'updatePassword', name: '2', component: () => import('../views/updatePassword.vue')
          }
        ]
      },
    ]
  },

  {
    path: '/stu',
    name: 'stu',
    component: () => import('../views/stuMain.vue'),
    children: [
      {
        path: 'Message',
        name: '3',
        component: Message1,
        children: [{
          path: 'Message2',
          name: '3',
          component: Message2
        },
        {
          path: 'Message3',
          name: '3',
          component: Message3
        }]
      },

      {
        path: 'Employ',
        name: '2',
        component: Employ
      },
      {
        path: 'practice',
        name: '1',
        component: practice
      },
      {path:"notice",name:"5",component:()=>import('../views/Student/NoticeView.vue')},
      {
        path: 'Monthly',
        name: '2-2',
        component: Monthly

      },
      {
        path: 'Fortnightly',
        name: '2-1',
        component: Fortnightly

      },

    ]
  },
  {
    path: '/com',
    name: 'com',
    component: () => import('../views/Corporation/CorHome.vue'),
    children: [
      {
        path: 'st',
        component: () => import('../views/Corporation/PositionManagement.vue')
      },
      {
        path: 'ViewApplicationList',
        component: () => import('../views/Corporation/ViewApplicationList.vue')
      },
      {
        path: 'updatePassword2',
        component: () => import('../views/Corporation/updatePassword2.vue')
      },
      {
        path: 'EditInformation',
        component: () => import('../views/Corporation/EditInformation.vue')
      },
      {
        path: 'InterviewArrangement',
        component: () => import('../views/Corporation/InterviewArrangement.vue')
      },
      {
        path: 'HistoricalRecord',
        component: () => import('../views/Corporation/HistoricalRecord.vue')
      }
    ]

  },
  {
    path: '/',
    name: 'login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/index.vue')
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
