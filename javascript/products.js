import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js";
import pagination from "./pagination.js";
let productModal = null;
let delProductModal = null;

const app = createApp({
  components: {
    pagination,
  },
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "pastelsy",
      products: [],
      newItem: false,
      pagination: {},
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
          alert(err);
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
    getData(page = 1) {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/?page=${page}`;
      axios
        .get(url)
        .then((response) => {
          this.products = response.data.products;
          this.pagination = response.data.pagination;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },

    // 點擊不同按鈕改變newItem狀態
    openModal(newItem, item) {
      if (newItem === "new") {
        this.tempProduct = {
          imagesURL: [],
        };
        this.newItem = true;
        productModal.show();
      } else if (newItem === "edit") {
        this.tempProduct = JSON.parse(JSON.stringify(item));
        this.newItem = false;
        productModal.show();
      } else if (newItem === "delete") {
        this.tempProduct = { ...item };
        delProductModal.show();
      }
    },
    uploadImage(event) {
      const formData = new FormData();
      let idName = event.target.id;
      const image = event.target.files[0];
      formData.append("image-to-upload", image);
      if (idName === "imageURL") {
        axios
          .post(`${this.apiUrl}/api/${this.apiPath}/admin/upload`, formData)
          .then((res) => {
            alert("success");
            this.tempProduct[idName] = res.data.imageUrl;
          })
          .catch((error) => {
            console.dir(error);
          });
      } else {
        axios
          .post(`${this.apiUrl}/api/${this.apiPath}/admin/upload`, formData)
          .then((res) => {
            alert("success");
            this.tempProduct[idName].push(res.data.imageUrl);
          })
          .catch((error) => {
            console.dir(error);
          });
      }
      event.target.value = "";
    },
    delImage(event) {
      this.tempProduct.imageURL = "";
      event.path[0].parentElement.children[1].value = "";
    },
    delMultiImage(index) {
      this.tempProduct.imagesURL.splice(index, 1);
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
});

app.component("productModal", {
  props: ["tempProduct", "newItem", "apiPath", "apiUrl"],
  template: "#templateforProductModal",
  methods: {
    updateData() {
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let http = "post";

      if (!this.newItem) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = "put";
      }

      axios[http](url, { data: this.tempProduct })
        .then((res) => {
          alert(res.data.message);
          //* this.getData();  內層無法用到getData()，所以用emit傳出
          this.$emit("get-data");
          productModal.hide();
        })
        .catch((error) => {
          alert(error);
          console.dir(error);
        });
    },
  },
});

app.component("delModal", {
  props: ["tempProduct", "apiPath", "apiUrl"],
  template: "#templateforDelModal",
  methods: {
    deleteData() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      axios
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          //* this.getData();  內層無法用到getData()，所以用emit傳出
          this.$emit("get-data");
          delProductModal.hide();
        })
        .catch((error) => {
          alert(error.data.message);
          console.dir(error);
        });
    },
  },
});

app.mount("#app");
