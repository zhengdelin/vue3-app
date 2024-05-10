import { defineComponent } from "vue";
import { inject } from "vue";
import { VALIDATION_FORM_COMPS } from "../constants/injection-symbols";
import { FormItem } from "../validation-form";
import { useVDeepModel, useVModel } from "@/composable/useVModel";
export default defineComponent({
  props: {
    items: {
      type: Array<FormItem>,
      required: true,
    },
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { attrs, slots, emit, expose }) {
    const components = inject(VALIDATION_FORM_COMPS, {});
    const modelValue = useVDeepModel({ props, emit });
    // console.log("components :>> ", components);

    const renderItems = (items: FormItem[], prefix = "") => {
      return items.map((item, idx) => {
        const Comp: any = typeof item.as === "string" ? components[item.as] : item.as;
        if (!Comp) return null;
        const props: Record<string, any> = {
          label: item.label,
          placeholder: item.placeholder,
          disabled: item.disabled,
          readonly: item.readonly,
          ...item.props,
        };
        if (item.prop) {
          props.modelValue = modelValue.value[item.prop];
          props["onUpdate:modelValue"] = (v: any) => {
            modelValue.value[item.prop as keyof typeof modelValue.value] = v;
          };
        }
        const { slotName, handledPrefix } = (() => {
          const prop = item.prop || idx;
          const handledPrefix = (prefix ? prefix + "-" : "") + prop;
          return {
            handledPrefix,
            slotName: `item-${handledPrefix}`,
          };
        })();

        const slotItems = (
          Array.isArray(item.slotItems || []) ? { default: item.slotItems } : item.slotItems
        ) as Record<string, FormItem[]>;

        // const compSlots = ;
        return (
          (slots[slotName] && slots[slotName]?.({ props, Comp })) || (
            <Comp
              {...props}
              v-slots={Object.entries(slotItems).reduce((prev, [key, v]) => {
                prev[key] = () => renderItems(v, handledPrefix);
                return prev;
              }, {} as Record<string, any>)}
            ></Comp>
          )
        );
      });
    };

    return () => <form>{renderItems(props.items)}</form>;
  },
});
