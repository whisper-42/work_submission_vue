import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

    user: {
      id: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).id,
      type: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).type,
      username: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).username,
      name: window.localStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).name,
      professionId: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).professionId,
      sex: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).sex,
      classesName: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).classesName,
      token: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).token,
    },
    professions: window.localStorage.getItem('professions' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('professions' || '[]')),
    classess: window.localStorage.getItem('classess' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('classess' || '[]')),
    courses: window.localStorage.getItem('courses' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('courses' || '[]')),
    students: window.localStorage.getItem('students' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('students' || '[]')),
    teachers: window.localStorage.getItem('teachers' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('teachers' || '[]')),
  },
  mutations: {
    login(state, user){
      state.user = user;
      window.localStorage.setItem('user', JSON.stringify(user));
    },
    setProfessions(state, professions) {
      state.professions = professions;
      window.localStorage.setItem('professions', JSON.stringify(professions));
    },
    setClassess(state, classess) {
      state.classess = classess
      window.localStorage.setItem('classess', JSON.stringify(classess));
    },
    setCourses(state, courses) {
      state.courses = courses
      window.localStorage.setItem('courses', JSON.stringify(courses));
    },
    setStudents(state, students) {
      state.students = students
      window.localStorage.setItem('students', JSON.stringify(students));
    },
    setTeachers(state, teachers) {
      state.teachers = teachers
      window.localStorage.setItem('teachers', JSON.stringify(teachers));
    },
    logout(state){
      state.user = '';
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('professions');
      window.localStorage.removeItem('classess');
      window.localStorage.removeItem('courses');
      window.localStorage.removeItem('students');
      window.localStorage.removeItem('teachers');
    }
  }
})
