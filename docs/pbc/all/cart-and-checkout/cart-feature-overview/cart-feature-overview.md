---
title: Cart feature overview
last_updated: Jul 20, 2021
template: concept-topic-template
originalLink: https://documentation.spryker.com/2021080/docs/cart
originalArticleId: eb211809-3be4-4b8a-bf28-a2c79140b11c
redirect_from:
  - /2021080/docs/cart
  - /2021080/docs/en/cart
  - /docs/cart
  - /docs/en/cart
  - /2021080/docs/shop-guide-shopping-carts-reference-information
  - /2021080/docs/en/shop-guide-shopping-carts-reference-information
  - /docs/shop-guide-shopping-carts-reference-information
  - /docs/en/shop-guide-shopping-carts-reference-information
  - /docs/scos/user/features/202200.0/cart-feature-overview/cart-feature-overview.html
  - /docs/scos/user/features/202204.0/cart-feature-overview/cart-feature-overview.html
  - /docs/scos/dev/feature-walkthroughs/202200.0/cart-feature-walkthrough/cart-feature-walkthrough.html  
  - /docs/scos/dev/feature-walkthroughs/202204.0/cart-feature-walkthrough/cart-feature-walkthrough.html    
---

The *Cart* feature lets your customers add products to their cart by selecting the needed quantity of a product. Inside the cart, customers can change the number of items, switch between different variants of the product, add notes, apply vouchers, and remove items.

Any changes the customer makes within the cart trigger an automatic sum-recalculation that is immediately applied to the total in the sum. Predefined taxes are applied and shown automatically. Additionally, logged-in customers can see and edit their cart from any device.  

The persistent cart functionality lets authenticated customers store their cart throughout multiple sessions. The Cart feature also ensures that your business rules, such as discounts, taxes, or shipping, are applied based on the customers' final choice of items.

Your customers can place orders faster by adding simple products to their cart from the **Category** page. They can add products with one [product variant](/docs/scos/user/features/{{page.version}}/product-feature-overview/product-feature-overview.html) to the cart with one click.

The feature supports [product groups](/docs/scos/user/features/{{page.version}}/product-groups-feature-overview.html). If simple products are grouped, you can browse and add these products to your cart from the **Category** page.

In a Spryker shop, the shopping cart widget is displayed in the header. With the widget, customers can easily create new shopping carts and view the existing ones by pointing to the cart icon.

## Related Business User articles

|OVERVIEWS|
|---|
| [Cart Notes](/docs/pbc/all/cart-and-checkout/cart-feature-overview/cart-notes-overview.html)  |
| [Cart Widget](/docs/pbc/all/cart-and-checkout/cart-feature-overview/cart-widget-overview.html)  |
| [Quick Order from the Catalog Page](/docs/pbc/all/cart-and-checkout/cart-feature-overview/quick-order-from-the-catalog-page-overview.html)   |

## Related Developer articles

|INSTALLATION GUIDES  | GLUE API GUIDES | TUTORIALS AND HOWTOS | REFERENCES |
|---------|---------|---------|---------|
|  [Cart feature integration](/docs/pbc/all/cart-and-checkout/install-and-upgrade/install-the-cart-feature.html) |  [Managing guest carts](/docs/marketplace/dev/glue-api-guides/{{page.version}}/guest-carts/managing-guest-carts.html) | [HowTo: Define if a cart should be deleted after placing an order](/docs/pbc/all/cart-and-checkout/tutorials-and-howtos/howto-define-if-a-cart-should-be-deleted-after-placing-an-order.html)  | [Calculation 3.0](/docs/pbc/all/cart-and-checkout/extend-and-customize/calculation-3-0.html) |
| [Install the Cart Glue API](/docs/pbc/all/cart-and-checkout/install-and-upgrade/install-the-cart-glue-api.html)  |  [Managing carts of registered users](/docs/marketplace/dev/glue-api-guides/{{page.version}}/carts-of-registered-users/managing-carts-of-registered-users.html) |   | [Calculation data structure](/docs/pbc/all/cart-and-checkout/extend-and-customize/calculation-data-structure.html) |
| [Install the Cart + Product Bundles feature](/docs/pbc/all/cart-and-checkout/install-and-upgrade/install-the-cart-product-bundles-feature-integration-feature.html) | [Retrieving customer carts](/docs/scos/dev/glue-api-guides/{{page.version}}/managing-customers/retrieving-customer-carts.html)  |   |  [Calculator plugins](/docs/pbc/all/cart-and-checkout/extend-and-customize/calculator-plugins.html) |
|  |   |   | [Cart module: Reference information](/docs/pbc/all/cart-and-checkout/extend-and-customize/cart-module-reference-information.html)  |