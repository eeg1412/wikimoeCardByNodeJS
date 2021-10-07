import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/common.css'
import 'primevue/resources/primevue.min.css'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css';
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import AutoComplete from 'primevue/autocomplete'
import RadioButton from 'primevue/radiobutton'
import InputNumber from 'primevue/inputnumber'
import Tag from 'primevue/tag'
import Dropdown from 'primevue/dropdown'
import FileUpload from 'primevue/fileupload'
import MultiSelect from 'primevue/multiselect'

import Slider from 'primevue/slider'
import InputSwitch from 'primevue/inputswitch'
import Dialog from 'primevue/dialog'

const app = createApp(App);
app.use(store).use(router).use(PrimeVue).use(ToastService).use(ConfirmationService).mount('#app')

app.component('InputText', InputText);
app.component('Password', Password);
app.component('Button', Button);
app.component('AutoComplete', AutoComplete);
app.component('RadioButton', RadioButton);
app.component('InputNumber', InputNumber);
app.component('Tag', Tag);
app.component('Dropdown', Dropdown);
app.component('FileUpload', FileUpload);
app.component('MultiSelect', MultiSelect);
app.component('Slider', Slider);
app.component('InputSwitch', InputSwitch);
app.component('Dialog', Dialog);