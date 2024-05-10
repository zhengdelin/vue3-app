import { App, provide } from "vue";
import { FormItem, RegisteredComps } from "./validation-form";
import ValidationForm from "./components/ValidationForm";
import { VALIDATION_FORM_COMPS } from "./constants/injection-symbols";

export function useValidationForm(formItems: FormItem[]) {
  return {
    formItems,
  };
}

useValidationForm.install = (app: App, components: RegisteredComps) => {
  app.component("ValidationForm", ValidationForm);
  app.provide(VALIDATION_FORM_COMPS, components);
};

export default useValidationForm;
