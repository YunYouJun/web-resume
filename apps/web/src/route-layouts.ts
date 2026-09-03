import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import NotFoundLayout from './layouts/404.vue'
import DefaultLayout from './layouts/default.vue'
import HomeLayout from './layouts/home.vue'

const layouts: Record<string, Component> = {
  404: NotFoundLayout,
  default: DefaultLayout,
  home: HomeLayout,
}

export function setupLayouts(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  function applyLayouts(routeRecords: RouteRecordRaw[], top = true): RouteRecordRaw[] {
    return routeRecords.map((route) => {
      if (route.children?.length)
        route.children = applyLayouts(route.children, false)

      const skipLayout = top
        && !route.component
        && route.children?.some(child => (child.path === '' || child.path === '/') && child.meta?.isLayout)

      if (skipLayout)
        return route

      if (top && route.meta?.layout === false)
        return route

      if (top || route.meta?.layout) {
        const layoutName = typeof route.meta?.layout === 'string'
          ? route.meta.layout
          : 'default'

        return {
          path: route.path,
          component: layouts[layoutName] ?? DefaultLayout,
          children: route.path === '/' ? [route] : [{ ...route, path: '' }],
          meta: { isLayout: true },
        }
      }

      return route
    })
  }

  return applyLayouts(routes)
}
