<script lang="ts" setup>
const { t } = useI18n()
</script>

<template>
  <section class="resume-empty-state" aria-labelledby="resume-empty-title">
    <span class="resume-empty-state__mark" aria-hidden="true">
      <span i-ri-file-user-line />
    </span>
    <h1 id="resume-empty-title">
      {{ t('onboarding.title') }}
    </h1>
    <p>{{ t('onboarding.description') }}</p>
    <OnboardingSteps />
  </section>
</template>

<style lang="scss" scoped>
.resume-empty-state {
  width: min(620px, calc(100% - 28px));
  margin: 0 auto;
  padding: clamp(28px, 6vw, 58px) 0;

  h1 {
    margin: 16px 0 8px;
    font-size: clamp(25px, 5vw, 38px);
    line-height: 1.15;
  }

  > p {
    margin: 0;
    color: rgb(127 127 127);
    line-height: 1.55;
  }
}

.resume-empty-state__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 17px;
  color: white;
  font-size: 26px;
  background: var(--wr-c-link);
  box-shadow: 0 12px 30px color-mix(in srgb, var(--wr-c-link), transparent 64%);
}
</style>
