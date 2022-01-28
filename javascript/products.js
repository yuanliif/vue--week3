import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js";
const product = {
  data: {
    title: "[賣]動物園造型衣服3",
    category: "衣服2",
    origin_price: 100,
    price: 300,
    unit: "個",
    description: "Sit down please 名設計師設計",
    content: "這是內容",
    is_enabled: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1573662012516-5cb4399006e7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80",
  },
};
const formData = new FormData(); //用來產生表單格式

createApp({
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "pastelsy",
      products: [],
      newItem: false,
      tempProduct: {
        imagesURL: [],
      },
    };
  },
  methods: {
    checkAdmin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios
        .post(url)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message);
          window.location = "index.html";
        });
    },
    logout() {
      const url = `${this.apiUrl}/logout`;
      axios
        .post(url)
        .then(() => {
          alert("Logout success");
          window.location = "index.html";
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    getData() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;
      axios
        .get(url)
        .then((response) => {
          console.log(response);
          this.products = response.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    getDataInfo(item) {
      this.tempProduct = item;
    },
    addData() {
      axios
        .post(`${this.apiUrl}/api/${this.apiPath}/admin/product`, product)
        .then((res) => {
          console.log(res.data);
          this.getData();
        })
        .catch((error) => {
          console.dir(error);
        });
    },
    deleteData(item) {
      axios
        .delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${item.id}`)
        .then((res) => {
          console.log(res.data);
          this.getData();
        })
        .catch((error) => {
          console.dir(error);
        });
    },
    uploadImage(event) {
      const file = event.target.files[0];
      formData.append("file-to-upload", file);
      axios
        .post(`${this.apiUrl}/api/${this.apiPath}/admin/upload`, formData)
        .then((res) => {
          alert("success");
          console.log(res.data);
          this.getUpload();
        })
        .catch((error) => {
          console.dir(error);
        });
    },
    getUpload() {
      const image = formData.getAll("file-to-upload");
      this.image = image.map((item) => {
        return item.name;
      });
    },
  },
  mounted() {
    productModal = new bootstrap.Modal(
      document.querySelector("#productModal"),
      {
        keyboard: false,
      }
    );
    delProductModal = new bootstrap.Modal(
      document.querySelector("#delProductModal"),
      {
        keyboard: false,
      }
    );
    // 取出 Token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)yuanToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;

    this.checkAdmin();
  },
}).mount("#app");
