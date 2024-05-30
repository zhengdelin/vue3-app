import useToggleScope from "@/composable/useToggleScope";
import { getTargetBox } from "../utils/box";
import { convertToUnit } from "../utils/helpers";
import isFixedPosition from "../utils/isFixedPosition";
import { makePropsDefault } from "../utils/props";
import { Point } from "./types";
import { CursorEl } from "./useActivator";

type Alignment = "start" | "center" | "end";
export interface LocationStrategyProps {
  locationStrategy: keyof typeof locationStrategies;
  position?: "top" | "bottom" | "start" | "end" | "center";
  alignment?: Alignment;
  offset?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
}

export const LOCATION_STRATEGY_PROPS_DEFAULT = makePropsDefault<LocationStrategyProps>({
  position: "center",
  alignment: "center",
  offset: 0,
});

interface LocationStrategyData {
  isActive: Ref<boolean>;
  target: Ref<HTMLElement | CursorEl | undefined>;
  contentEl: Ref<HTMLElement | undefined>;
}

const locationStrategies = {
  static: staticLocationStrategy,
  connected: connectedLocationStrategy,
};

export function useLocationStrategy(props: LocationStrategyProps, data: LocationStrategyData) {
  const { isActive, target, contentEl } = data;
  const contentStyles = ref({});
  const updateLocation = ref<(e: Event) => void>();

  useToggleScope(
    () => !!isActive.value && !!props.locationStrategy,
    (reset) => {
      watch(() => props.locationStrategy, reset);
      onScopeDispose(() => {
        window.removeEventListener("resize", onResize);
        updateLocation.value = undefined;
      });

      window.addEventListener("resize", onResize, { passive: true });

      if (typeof props.locationStrategy === "function") {
        //
      } else {
        updateLocation.value = locationStrategies[props.locationStrategy](props, data, contentStyles)?.updateLocation;
      }
    },
  );

  function onResize(e: Event) {
    updateLocation.value?.(e);
  }

  return {
    contentStyles,
  };
}

function staticLocationStrategy() {
  //
}

function connectedLocationStrategy(
  props: LocationStrategyProps,
  data: LocationStrategyData,
  contentStyles: Ref<Record<string, string>>,
) {
  // console.group("connectedLocationStrategy");
  // console.log("🚀 ~ contentStyles:", contentStyles.value);
  // console.log("🚀 ~ data:", data.contentEl.value, data.target.value);
  // console.log("🚀 ~ props:", props);
  // console.groupEnd();
  const isTargetFixed = Array.isArray(data.target.value) || isFixedPosition(data.target.value);
  if (isTargetFixed) {
    // console.log("isTargetFixed");
    Object.assign(contentStyles.value, {
      position: "fixed",
    });
  }

  const [minWidth, maxWidth, minHeight, maxHeight] = (["minWidth", "maxWidth", "minHeight", "maxHeight"] as const).map(
    (key) => {
      return computed(() => {
        const _v = props[key];
        if (!_v) return Infinity;

        const val = typeof _v === "number" ? _v : parseFloat(_v);
        return isNaN(val) ? Infinity : val;
      });
    },
  );

  function updateLocation() {
    const { target, contentEl } = data;
    const { position, alignment, offset: _offset } = props;
    if (!target.value || !contentEl.value || !position || !alignment) return;

    const offset = parseFloat(_offset as string) || 0;
    const targetBox = getTargetBox(target.value);
    const contentBox = getTargetBox(contentEl.value);

    // position
    const posMap = _getPositionMap();
    let [x, y] = posMap[position][alignment]();

    x += document.documentElement.scrollLeft;
    y += document.documentElement.scrollTop;

    const axis = position === "start" || position === "end" ? "x" : "y";

    Object.assign(contentStyles.value, {
      top: convertToUnit(y),
      left: convertToUnit(x),
      minWidth: convertToUnit(axis === "y" ? Math.min(minWidth.value, targetBox.width) : minWidth.value),
      maxWidth: convertToUnit(maxWidth.value),
      maxHeight: convertToUnit(maxHeight.value),
    });

    function _getPositionMap() {
      type AlignmentMap = Record<Alignment, (x: number, y: number) => Point>;
      /**
       * FinalPoint 相當於 default + alignment的偏移量 + offset的偏移量
       * @param defaultPoint
       * @param map
       * @param offsetTransform
       * @returns
       */
      const createMap = (defaultPoint: Point, map: AlignmentMap, offsetTransform: (x: number, y: number) => Point) => {
        return Object.entries(map).reduce((prev, [key, value]) => {
          prev[key as Alignment] = () => {
            const alignedPoint = value(defaultPoint[0], defaultPoint[1]);
            if (!offset) {
              return [alignedPoint[0], alignedPoint[1]];
            }
            return offsetTransform(alignedPoint[0], alignedPoint[1]);
          };
          return prev;
        }, {} as Record<Alignment, () => Point>);
      };

      const alignmentHorizontalMap: AlignmentMap = {
        start: (x, y) => [x, y],
        center: (_x, y) => [targetBox.left + targetBox.width / 2 - contentBox.width / 2, y],
        end: (_, y) => [targetBox.right - contentBox.width, y],
      };
      const alignmentVerticalMap: AlignmentMap = {
        start: (x, y) => [x, y],
        center: (x) => [x, targetBox.top + targetBox.height / 2 - contentBox.height / 2],
        end: (x) => [x, targetBox.bottom - contentBox.height],
      };

      const top = createMap([targetBox.left, targetBox.top - contentBox.height], alignmentHorizontalMap, (x, y) => [
        x,
        y - offset,
      ]);

      const bottom = createMap([targetBox.left, targetBox.bottom], alignmentHorizontalMap, (x, y) => [x, y + offset]);

      const start = createMap([targetBox.left - contentBox.width, targetBox.top], alignmentVerticalMap, (x, y) => [
        x - offset,
        y,
      ]);

      const end = createMap([targetBox.right, targetBox.top], alignmentVerticalMap, (x, y) => [x + offset, y]);

      const center = createMap(
        [
          targetBox.left + targetBox.width / 2 - contentBox.width / 2,
          targetBox.top + targetBox.height / 2 - contentBox.height / 2,
        ],
        {
          start: (x, y) => [x, y],
          center: (x, y) => [x, y],
          end: (x, y) => [x, y],
        },
        (x, y) => [x, y],
      );

      return {
        top,
        bottom,
        start,
        end,
        center,
      };
    }
  }

  nextTick(() => {
    updateLocation();
    requestAnimationFrame(() => {
      updateLocation();
    });
  });

  watch(
    () => [
      props.position,
      props.alignment,
      props.offset,
      props.maxWidth,
      props.minWidth,
      props.maxHeight,
      props.minHeight,
    ],
    updateLocation,
  );

  return {
    updateLocation,
  };
}
