---
title: "HowTo: Create a new module with application"
last_updated: Aug 31, 2022
description: This document shows how to create a new module with the application
template: howto-guide-template
---

This document describes how to create a new module with the application.

## 1) Create module scaffolding structure

A new module needs to have a proper scaffolding structure. The necessary list of files is provided in the [Project structure article, Module structure section](/docs/marketplace/dev/front-end/{{site.version}}/project-structure.html#module-structure). Each new module can contain its own set of Twig Web Components.

## 2) Register a new module

To register components, a special Angular Module is created. The `components.module.ts` file contains a list of all Angular Components that will be exposed as Web Components.

1. Register Web Components:

```ts
// Registration
import { NgModule } from '@angular/core';
import { WebComponentsModule } from '@spryker/web-components';

import { SomeComponentComponent } from './some-component/some-component.component';
import { SomeComponentModule } from './some-component/some-component.module';

@NgModule({
    imports: [
        WebComponentsModule.withComponents([SomeComponentComponent]),
        SomeComponentModule,
    ],
    providers: [],
})
export class ComponentsModule {}
```

2. Register `ComponentsModule` to the entire modules list inside `entry.ts`:

```ts
import { registerNgModule } from '@mp/zed-ui';

import { ComponentsModule } from './app/components.module';

registerNgModule(ComponentsModule);
```

By registering and rebuilding this module, a new JS bundle is created, which must be manually added to the Twig page in order to load Web Components.

{% info_block warningBox %}

Angular Component names are prefixed with `web-` when registered as Web Components, for example:

```ts
import { Component } from '@angular/core';

@Component({
    selector: 'mp-some-component',
    ...,
})
export class SomeComponentComponent {}

// After web component registration selector will be look like if we use this component as web inside twig file:
'web-mp-some-component'
```

```twig
{%- raw -%}
{% extends '@ZedUi/Layout/merchant-layout-main.twig' %}

{% block headTitle %}
    {{ 'Module title' | trans }}
{% endblock %}

{% block content %}
    <web-some-component></web-some-component>
{% block content %}

{% block footerJs %}
    {{ view.importJsBundle('module-name', importConfig) }}
    
    {{ parent() }}
{% endblock %}
{% endraw %}
```

{% endinfo_block %}
