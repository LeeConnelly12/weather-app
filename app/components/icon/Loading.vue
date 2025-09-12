<template>
  <svg class="inline-block fill-neutral-200" width="64" fill="none" viewBox="0 0 32 24" aria-hidden="true">
    <circle cx="6" cy="12" r="3">
      <animate
        id="spinner_qFRN"
        begin="0;spinner_OcgL.end+0.25s"
        attributeName="cy"
        calcMode="spline"
        dur="0.6s"
        values="12;6;12"
        keySplines=".33,.66,.66,1;.33,0,.66,.33"
      />
    </circle>
    <circle cx="16" cy="12" r="3">
      <animate
        begin="spinner_qFRN.begin+0.1s"
        attributeName="cy"
        calcMode="spline"
        dur="0.6s"
        values="12;6;12"
        keySplines=".33,.66,.66,1;.33,0,.66,.33"
      />
    </circle>
    <circle cx="26" cy="12" r="3">
      <animate
        id="spinner_OcgL"
        begin="spinner_qFRN.begin+0.2s"
        attributeName="cy"
        calcMode="spline"
        dur="0.6s"
        values="12;6;12"
        keySplines=".33,.66,.66,1;.33,0,.66,.33"
      />
    </circle>
  </svg>
</template>
