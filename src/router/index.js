import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('@/components/login')
const Home = () => import('@/components/home')
const AdminStudent = () => import('@/components/admin/student')
const AdminCourse = () => import('@/components/admin/course')
const AdminClasses = () => import('@/components/admin/classes')
const AdminProfession = () => import('@/components/admin/profession')
const AdminTeacher = () => import('@/components/admin/teacher')
const TeacherReleaseWork = () => import('@/components/teacher/releaseWork')
const TeacherShowWork = () => import('@/components/teacher/showWork')
const TeacherShowSubmissionWork = () => import('@/components/teacher/showSubmissionWork')
const StudentNewWork = () => import('@/components/student/newWork')
const StudentWorkRecord = () => import('@/components/student/workRecord')
const NotFoundPage = () => import('@/components/NotFoundPage')


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: Login
    }, {
      path: '/home',
      component: Home,
      children: [
        {
          name:"学生管理",
          path: '/student',
          component: AdminStudent
        }, {
          name:"班级管理",
          path: '/classes',
          component: AdminClasses
        }, {
          name:"教师管理",
          path: '/teacher',
          component: AdminTeacher
        }, {
          name:"课程管理",
          path: '/course',
          component: AdminCourse
        }, {
          name:"专业管理",
          path: '/profession',
          component: AdminProfession
        }, {
          name:"发布作业",
          path: '/releaseWork',
          component: TeacherReleaseWork
        }, {
          name:"已发布的作业",
          path: '/showWork',
          component: TeacherShowWork
        }, {
          name:"查看学生作业",
          path: '/showSubmissionWork',
          component: TeacherShowSubmissionWork
        }, {
          name:"新的作业",
          path: '/newWork',
          component: StudentNewWork
        }, {
          name:"作业记录",
          path: '/workRecord',
          component: StudentWorkRecord
        }
      ]
    }, {
      path:'*',
      name:'notfoundpage',
      component: NotFoundPage
    }
  ]
})
