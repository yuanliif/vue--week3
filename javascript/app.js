import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js";

const url = "https://vue3-course-api.hexschool.io/v2"; // 加入站點
const loginApi = url + "/admin/signin"; // api網址

const app = createApp({
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      axios
        .post(loginApi, this.user)
        .then((res) => {
          const { token, expired } = res.data;
          alert("登入成功");
          document.cookie = `yuanToken = ${token}; expires=${new Date(
            expired
          )}`;
          window.location = "products.html";
        })
        .catch((error) => {
          console.dir(error);
          alert(error.response.data.message);
        });
    },
  },
});

app.mount("#app");
