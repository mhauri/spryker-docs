---
title: Merchant Opening Hours feature integration
last_updated: Mar 31, 2021
summary: This document describes how to integrate the Merchant Portal Core feature into a Spryker project.
---

## Install Feature Core
Follow the steps below to install the Merchant Opening Hours feature core.

### Prerequisites

To start feature integration, overview and install the necessary features:

| Name                 | Version    |
| -------------------- | ---------- |
| Spryker Core         | 202001.0   |
| Marketplace Merchant | dev-master |

###  1) Install the Required Modules Using Composer

Run the following command(s) to install the required modules:

```bash
composer require spryker-feature/merchant-opening-hours 
```

Make sure that the following modules were installed:ModuleExpected DirectoryMerchantOpeningHoursspryker/merchant-opening-hoursMerchantOpeningHoursDataImportspryker/merchant-opening-hours-data-importMerchantOpeningHoursStoragespryker/merchant-opening-hours-storageWeekdaySchedulespryker/weekday-schedule 

## 2) Set up database schema

Adjust the schema definition so entity changes will trigger events:

src/Pyz/Zed/MerchantOpeningHours/Persistence/Propel/Schema/spy_merchant_opening_hours.schema.xml

```xml
<?xml version="1.0"?>
<database xmlns="spryker:schema-01" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" name="zed" xsi:schemaLocation="spryker:schema-01 https://static.spryker.com/schema-01.xsd"
          namespace="Orm\Zed\MerchantOpeningHours\Persistence"
          package="src.Orm.Zed.MerchantOpeningHours.Persistence">
 
    <table name="spy_merchant_opening_hours_date_schedule" phpName="SpyMerchantOpeningHoursDateSchedule" identifierQuoting="true">
        <behavior name="event">
            <parameter name="spy_merchant_opening_hours_date_schedule_all" column="*"/>
        </behavior>
    </table>
 
    <table name="spy_merchant_opening_hours_weekday_schedule" phpName="SpyMerchantOpeningHoursWeekdaySchedule" identifierQuoting="true">
        <behavior name="event">
            <parameter name="spy_merchant_opening_hours_weekday_schedule_all" column="*"/>
        </behavior>
    </table>
 
</database>
```

src/Pyz/Zed/MerchantOpeningHoursStorage/Persistence/Propel/Schema/spy_merchant_opening_hours_storage.schema.xml

```xml
<?xml version="1.0"?>
<database xmlns="spryker:schema-01"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          name="zed"
          xsi:schemaLocation="spryker:schema-01 https://static.spryker.com/schema-01.xsd"
          namespace="Orm\Zed\MerchantOpeningHoursStorage\Persistence"
          package="src.Orm.Zed.MerchantOpeningHoursStorage.Persistence">

    <table name="spy_merchant_opening_hours_storage" phpName="SpyMerchantOpeningHoursStorage">
        <behavior name="synchronization">
            <parameter name="queue_pool" value="synchronizationPool"/>
        </behavior>
    </table>

</database>
```


Run the following commands to apply database changes and to generate entity and transfer changes.

```bash
console transfer:generate console propel:install console transfer:generate 
```



Verify the following changes have been applied by checking your database:

| Database entity                             | Type  | Event   |
| ------------------------------------------ | ---- | ------ |
| spy_merchant_opening_hours_weekday_schedule | table | created |
| spy_merchant_opening_hours_date_schedule    | table | created |
| spy_weekday_schedule                        | table | created |
| spy_date_schedule                           | table | created |



Make sure that the following changes in transfer objects:

| Transfer                        | Type  | Event   | Path                                                         |
| ------------------------------ | ---- | ------ | ---------------------------------------------------------- |
| WeekdaySchedule                 | class | created | src/Generated/Shared/Transfer/WeekdayScheduleTransfer        |
| DataImporterReaderConfiguration | class | created | src/Generated/Shared/Transfer/DataImporterReaderConfigurationTransfer |
| MerchantCriteria                | class | created | src/Generated/Shared/Transfer/MerchantCriteriaTransfer       |
| MerchantOpeningHoursStorage     | class | created | src/Generated/Shared/Transfer/MerchantOpeningHoursStorageTransfer |

### 3) Add translations

#### Zed translations

Run the following command to generate a new translation cache for Zed:

```bash
console translator:generate-cache
```

### 4) Configure export to Redis

This step will publish change events to the spy_merchant_opening_hours_storage and synchronize the data to Storage.

#### Set up event, listeners and publishers

| Plugin  | Specification | Prerequisites | Namespace  |
| ----------- | -------------- | ------------- | ------------- |
| MerchantOpeningHoursStorageEventSubscriber | Registers listeners that are responsible for publishing merchant opening hours entity changes to storage. | None  | Spryker\Zed\MerchantOpeningHoursStorage\Communication\Plugin\Event\Subscriber |

src/Pyz/Zed/Event/EventDependencyProvider.php

```php
<?php
 
namespace Pyz\Zed\Event;
 
use Spryker\Zed\MerchantOpeningHoursStorage\Communication\Plugin\Event\Subscriber\MerchantOpeningHoursStorageEventSubscriber;
 
class EventDependencyProvider extends SprykerEventDependencyProvider
{
    public function getEventSubscriberCollection()
    {
        $eventSubscriberCollection = parent::getEventSubscriberCollection();
        $eventSubscriberCollection->add(new MerchantOpeningHoursStorageEventSubscriber());
 
        return $eventSubscriberCollection;
    }
}
```

#### Configure message processors

| Plugin                                            | Specification                                                | Prerequisites | Namespace                                              |
| ------------------------------------------------- | :----------------------------------------------------------- | :------------ | :----------------------------------------------------- |
| SynchronizationStorageQueueMessageProcessorPlugin | Configures all merchant profile and merchant opening hours messages to sync with Redis storage, and marks messages as failed in case of error. | None          | Spryker\Zed\Synchronization\Communication\Plugin\Queue |

src/Pyz/Zed/Queue/QueueDependencyProvider.php

```php
<?php
 
namespace Pyz\Zed\Queue;
 
use Spryker\Shared\MerchantOpeningHoursStorageConfig\MerchantOpeningHoursStorageConfig;
use Spryker\Zed\Kernel\Container;
use Spryker\Zed\Queue\QueueDependencyProvider as SprykerDependencyProvider;
use Spryker\Zed\Synchronization\Communication\Plugin\Queue\SynchronizationSearchQueueMessageProcessorPlugin;
 
class QueueDependencyProvider extends SprykerDependencyProvider
{
    /**
     * @param \Spryker\Zed\Kernel\Container $container
     *
     * @return \Spryker\Zed\Queue\Dependency\Plugin\QueueMessageProcessorPluginInterface[]
     */
    protected function getProcessorMessagePlugins(Container $container)
    {
        return [
            MerchantOpeningHoursStorageConfig::MERCHANT_OPENING_HOURS_SYNC_STORAGE_QUEUE => new SynchronizationStorageQueueMessageProcessorPlugin(),
        ];
    }
}
```

### Set up re-generate and re-sync features

| Plugin  | Specification  | Prerequisites | Namespace  |
| ------------------- | ------------------ | ------------- | --------------- |
| MerchantOpeningHoursSynchronizationDataBulkPlugin | Allows synchronizing the entire storage table content into Storage. | None  | `Spryker\Zed\MerchantOpeningHoursStorage\Communication\Plugin\Synchronization` |

src/Pyz/Zed/Synchronization/SynchronizationDependencyProvider.php

```php
<?php
 
namespace Pyz\Zed\Synchronization;
 
use Spryker\Zed\MerchantOpeningHoursStorage\Communication\Plugin\Synchronization\MerchantOpeningHoursSynchronizationDataBulkPlugin;
use Spryker\Zed\Synchronization\SynchronizationDependencyProvider as SprykerSynchronizationDependencyProvider;
 
class SynchronizationDependencyProvider extends SprykerSynchronizationDependencyProvider
{
    /**
     * @return \Spryker\Zed\SynchronizationExtension\Dependency\Plugin\SynchronizationDataPluginInterface[]
     */
    protected function getSynchronizationDataPlugins(): array
    {
        return [
            new MerchantOpeningHoursSynchronizationDataBulkPlugin(),
        ];
    }
}
```

#### Configure synchronization pool name

src/Pyz/Zed/MerchantOpeningHoursStorage/MerchantOpeningHoursStorageConfig.php

```php
<?php
 
namespace Pyz\Zed\MerchantOpeningHoursStorage;
 
use Pyz\Zed\Synchronization\SynchronizationConfig;
use Spryker\Zed\MerchantOpeningHoursStorage\MerchantOpeningHoursStorageConfig as SprykerMerchantOpeningHoursStorageStorageConfig;
 
class MerchantOpeningHoursStorageConfig extends SprykerMerchantOpeningHoursStorageStorageConfig
{
    /**
     * @return string|null
     */
    public function getMerchantOpeningHoursSynchronizationPoolName(): ?string
    {
        return SynchronizationConfig::DEFAULT_SYNCHRONIZATION_POOL_NAME;
    }
}
```

1. Make sure that after step #1 commands `console sync:data merchant_opening_hours` exports data from `spy_merchant_opening_hours_storage` table to Redis.

2. Make sure that when merchant opening hours entities get created or updated through ORM, it is exported to Redis accordingly.

| Target entity | Example expected data identifier |
| ---------------- | ----------------- |
| MerchantOpeningHours | kv:merchant_opening_hours:1 |

Example expected data fragment

```
{ 
   "weekday_schedule":[ 
      { 
         "day":"MONDAY",
         "time_from":"07:00:00.000000",
         "time_to":"13:00:00.000000"
      },
      { 
         "day":"MONDAY",
         "time_from":"14:00:00.000000",
         "time_to":"20:00:00.000000"
      },
      { 
         "day":"TUESDAY",
         "time_from":"07:00:00.000000",
         "time_to":"20:00:00.000000"
      },
      { 
         "day":"WEDNESDAY",
         "time_from":"07:00:00.000000",
         "time_to":"20:00:00.000000"
      },
      { 
         "day":"THURSDAY",
         "time_from":"07:00:00.000000",
         "time_to":"20:00:00.000000"
      },
      { 
         "day":"FRIDAY",
         "time_from":"07:00:00.000000",
         "time_to":"20:00:00.000000"
      },
      { 
         "day":"SATURDAY",
         "time_from":"07:00:00.000000",
         "time_to":"20:00:00.000000"
      },
      { 
         "day":"SUNDAY",
         "time_from":null,
         "time_to":null
      }
   ],
   "date_schedule":[ 
      { 
         "date":"2020-01-01",
         "time_from":null,
         "time_to":null,
         "note":"merchant_weekday_schedule.new_year"
      },
      { 
         "date":"2021-12-31",
         "time_from":"10:00:00.000000",
         "time_to":"17:00:00.000000",
         "note":""
      }
   ]
}
```

### 5) Import Data

#### Import Merchants Opening Hours data

Prepare your data according to your requirements using our demo data:

vendor/spryker/spryker/Bundles/MerchantOpeningHoursDataImport/data/import/merchant_open_hours_date_schedule.csv

```
merchant_reference,date,time_from,time_to,note MER000001,2020-01-01,,,merchant_weekday_schedule.new_year MER000001,2020-04-10,,,merchant_weekday_schedule.good_friday MER000001,2020-04-12,,,merchant_weekday_schedule.easter_sunday MER000001,2020-04-13,,,merchant_weekday_schedule.easter_monday MER000001,2020-05-01,,,merchant_weekday_schedule.may_day MER000001,2020-05-21,,,merchant_weekday_schedule.ascension_of_christ MER000001,2020-05-31,,,merchant_weekday_schedule.whit_sunday MER000001,2020-06-01,,,merchant_weekday_schedule.whit_monday MER000001,2020-06-11,,,merchant_weekday_schedule.corpus_christi MER000001,2020-10-03,,,merchant_weekday_schedule.day_of_german_unity MER000001,2020-11-01,,,merchant_weekday_schedule.all_saints_day MER000001,2020-12-25,,,merchant_weekday_schedule.1st_christmas_day MER000001,2020-12-26,,,merchant_weekday_schedule.2nd_christmas_day MER000001,2021-11-28,13:00:00,18:00:00,merchant_weekday_schedule.sunday_opening MER000001,2021-12-31,10:00:00,17:00:00, MER000002,2020-01-01,,,merchant_weekday_schedule.new_year MER000002,2020-04-10,,,merchant_weekday_schedule.good_friday MER000002,2020-04-12,,,merchant_weekday_schedule.easter_sunday MER000002,2020-04-13,,,merchant_weekday_schedule.easter_monday MER000002,2020-05-01,,,merchant_weekday_schedule.may_day MER000002,2020-05-21,,,merchant_weekday_schedule.ascension_of_christ MER000002,2020-05-31,,,merchant_weekday_schedule.whit_sunday MER000002,2020-06-01,,,merchant_weekday_schedule.whit_monday MER000002,2020-06-11,,,merchant_weekday_schedule.corpus_christi MER000002,2020-10-03,,,merchant_weekday_schedule.day_of_german_unity MER000002,2020-11-01,,,merchant_weekday_schedule.all_saints_day MER000002,2020-12-25,,,merchant_weekday_schedule.1st_christmas_day MER000002,2020-12-26,,,merchant_weekday_schedule.2nd_christmas_day MER000006,2020-01-01,,,merchant_weekday_schedule.new_year MER000006,2020-04-10,,,merchant_weekday_schedule.good_friday MER000006,2020-04-12,,,merchant_weekday_schedule.easter_sunday MER000006,2020-04-13,,,merchant_weekday_schedule.easter_monday MER000006,2020-05-01,,,merchant_weekday_schedule.may_day MER000006,2020-05-21,,,merchant_weekday_schedule.ascension_of_christ MER000006,2020-05-31,,,merchant_weekday_schedule.whit_sunday MER000006,2020-06-01,,,merchant_weekday_schedule.whit_monday MER000006,2020-06-11,,,merchant_weekday_schedule.corpus_christi MER000006,2020-10-03,,,merchant_weekday_schedule.day_of_german_unity MER000006,2020-11-01,,,merchant_weekday_schedule.all_saints_day MER000006,2020-12-25,,,merchant_weekday_schedule.1st_christmas_day MER000006,2020-12-26,,,merchant_weekday_schedule.2nd_christmas_day MER000006,2021-11-28,13:00:00,18:00:00,merchant_weekday_schedule.sunday_opening MER000006,2021-12-31,10:00:00,17:00:00, MER000005,2020-01-01,,,merchant_weekday_schedule.new_year MER000005,2020-04-10,,,merchant_weekday_schedule.good_friday MER000005,2020-04-12,,,merchant_weekday_schedule.easter_sunday MER000005,2020-04-13,,,merchant_weekday_schedule.easter_monday MER000005,2020-05-01,,,merchant_weekday_schedule.may_day MER000005,2020-05-21,,,merchant_weekday_schedule.ascension_of_christ MER000005,2020-05-31,,,merchant_weekday_schedule.whit_sunday MER000005,2020-06-01,,,merchant_weekday_schedule.whit_monday MER000005,2020-06-11,,,merchant_weekday_schedule.corpus_christi MER000005,2020-10-03,,,merchant_weekday_schedule.day_of_german_unity MER000005,2020-11-01,,,merchant_weekday_schedule.all_saints_day MER000005,2020-12-25,,,merchant_weekday_schedule.1st_christmas_day MER000005,2020-12-26,,,merchant_weekday_schedule.2nd_christmas_day MER000005,2021-11-28,13:00:00,18:00:00,merchant_weekday_schedule.sunday_opening MER000005,2021-12-31,10:00:00,13:00:00, MER000005,2021-12-31,14:00:00,17:00:00, 
```

| Column    | Is Obligatory? | Data Type | Data Example  | Data explanation |
| ------------- | -------------- | --------- | ------------ | ---------------------- |
| merchant_reference | mandatory  | string | MER000005  | Merchant identifier.  |
| date | mandatory | string    | 2020-01-01  | Date with special opening hours  |
| time_from  | optional | string    | 10:00:00  | Time start when the merchant is open on this special date. Empty means open ended |
| time_to  | optional  | string | 13:00:00  | Time end when the merchant is open on this special date. Empty means open ended |
| note  | optional  | string | merchant_weekday_schedule.day_of_german_unity | Glossary key to show a note next to special opening hours  |

vendor/spryker/spryker/Bundles/MerchantOpeningHoursDataImport/data/import/merchant_open_hours_week_day_schedule.csv

```
merchant_reference,week_day_key,time_from,time_to MER000001,MONDAY,7:00:00,13:00:00 MER000001,MONDAY,14:00:00,20:00:00 MER000001,TUESDAY,7:00:00,20:00:00 MER000001,WEDNESDAY,7:00:00,20:00:00 MER000001,THURSDAY,7:00:00,20:00:00 MER000001,FRIDAY,7:00:00,20:00:00 MER000001,SATURDAY,7:00:00,20:00:00 MER000001,SUNDAY,, MER000002,MONDAY,8:00:00,13:00:00 MER000002,MONDAY,14:00:00,19:00:00 MER000002,TUESDAY,8:00:00,19:00:00 MER000002,WEDNESDAY,8:00:00,19:00:00 MER000002,THURSDAY,8:00:00,19:00:00 MER000002,FRIDAY,8:00:00,19:00:00 MER000002,SATURDAY,8:00:00,19:00:00 MER000002,SUNDAY,, MER000006,MONDAY,7:00:00,13:00:00 MER000006,MONDAY,14:00:00,20:00:00 MER000006,TUESDAY,7:00:00,20:00:00 MER000006,WEDNESDAY,7:00:00,20:00:00 MER000006,THURSDAY,7:00:00,20:00:00 MER000006,FRIDAY,7:00:00,20:00:00 MER000006,SATURDAY,7:00:00,20:00:00 MER000006,SUNDAY,, MER000005,MONDAY,8:00:00,13:00:00 MER000005,MONDAY,14:00:00,19:00:00 MER000005,TUESDAY,8:00:00,19:00:00 MER000005,WEDNESDAY,8:00:00,19:00:00 MER000005,THURSDAY,8:00:00,19:00:00 MER000005,FRIDAY,8:00:00,19:00:00 MER000005,SATURDAY,8:00:00,19:00:00 MER000005,SUNDAY,,
```



| Column  | Is Obligatory? | Data Type | Data Example | Data explanation |
| ----------- | ---------- | --------- | ------------ | ---------------- |
| `merchant_reference` | mandatory | string | MER000005 | Merchant identifier.  |
| week_day_key | mandatory | `string`  | MONDAY | Day of the week to assign opening hours to a merchant.It is an enum in database with the following values:MONDAYTUESDAYWEDNESDAYTHURSDAYFRIDAYSATURDAYSUNDAY |
| `time_from`   | optional | string | `8:00:00`  | Time start when the merchant is open on this week day. Empty means open ended. |
| `time_to`  | optional  | string | `19:00:00`| Time end when the merchant is open on this week day. Empty means open ended. |

Register the following plugins to enable data import:

| Plugin | Specification  | Prerequisites | Namespace  |
| -------------------- | ----------- | ------------- | ------------ |
| MerchantOpeningHoursDateScheduleDataImportPlugin | Imports special dates opening hours into the database  | None  | Spryker\Zed\MerchantOpeningHoursDataImport\Communication\Plugin |
| MerchantOpeningHoursWeekdayScheduleDataImportPlugin | Imports weekly schedule opening hours into the database | None | Spryker\Zed\MerchantOpeningHoursDataImport\Communication\Plugin |

src/Pyz/Zed/DataImport/DataImportDependencyProvider.php

```php
<?php
  
namespace Pyz\Zed\DataImport;
  
use Spryker\Zed\DataImport\DataImportDependencyProvider as SprykerDataImportDependencyProvider;
use Spryker\Zed\MerchantOpeningHoursDataImport\Communication\Plugin\MerchantOpeningHoursDateScheduleDataImportPlugin;
use Spryker\Zed\MerchantOpeningHoursDataImport\Communication\Plugin\MerchantOpeningHoursWeekdayScheduleDataImportPlugin;
 
class DataImportDependencyProvider extends SprykerDataImportDependencyProvider
{
    protected function getDataImporterPlugins(): array
    {
        return [
            new MerchantOpeningHoursDateScheduleDataImportPlugin(),
            new MerchantOpeningHoursWeekdayScheduleDataImportPlugin(),
        ];
    }
}
```

Run the following console command to import data:

```bash
console data:import merchant-opening-hours-date-schedule console data:import merchant-opening-hours-weekday-schedule 
```

Make sure that the opening hours data is added to the `spy_merchant_opening_hours_weekday_schedule`and `spy_merchant_opening_hours_date_schedule` tables in the database.

## Install feature front end

### Prerequisites

To start feature integration, overview, and install the necessary features:

| Name         | Version  |
| ------------ | -------- |
| Spryker Core | 202001.0 |



### 1) Install the required modules using composer

If installed before, not needed.

Verify if the following modules were installed:

| Module                     | Expected Directory                         |
| :------------------------- | :----------------------------------------- |
| MerchantOpeningHoursWidget | spryker-shop/merchant-opening-hours-widget |

### 2) Add translations

#### Yves translations

Append glossary according to your configuration:

src/data/import/glossary.csv

```
merchant_opening_hours.opening_hours_title,Opening Hours,en_US merchant_opening_hours.opening_hours_title,Öffnungszeiten,de_DE merchant_opening_hours.special_opening_hours_title,Special Opening Hours,en_US merchant_opening_hours.special_opening_hours_title,Besondere Öffnungszeiten,de_DE merchant_opening_hours.public_holidays_title,Public Holidays,en_US merchant_opening_hours.public_holidays_title,Feiertage,de_DE merchant_opening_hours.opening_hours_closed,Closed,en_US merchant_opening_hours.opening_hours_closed,Geschlossen,de_DE merchant_opening_hours.day.title.monday,Monday,en_US merchant_opening_hours.day.title.monday,Montag,de_DE merchant_opening_hours.day.title.tuesday,Tuesday,en_US merchant_opening_hours.day.title.tuesday,Dienstag,de_DE merchant_opening_hours.day.title.wednesday,Wednesday,en_US merchant_opening_hours.day.title.wednesday,Mittwoch,de_DE merchant_opening_hours.day.title.thursday,Thursday,en_US merchant_opening_hours.day.title.thursday,Donnerstag,de_DE merchant_opening_hours.day.title.friday,Friday,en_US merchant_opening_hours.day.title.friday,Freitag,de_DE merchant_opening_hours.day.title.saturday,Saturday,en_US merchant_opening_hours.day.title.saturday,Samstag,de_DE merchant_opening_hours.day.title.sunday,Sunday,en_US merchant_opening_hours.day.title.sunday,Sonntag,de_DE 
```

Run the following console command to import data:

```
console data:import glossary
```

Make sure that in the database, the configured data is added to the spy_glossary table.

## 3) Set up widgets

Register the following plugins to enable widgets:

| Plugin | Description  | Prerequisites | Namespace  |
| --------------- | ------------------ | ------------- | --------------- |
| MerchantOpeningHoursWidget | Displays merchant working hours. | None  | SprykerShop\Yves\MerchantOpeningHoursWidget\Widget |

src/Pyz/Yves/ShopApplication/ShopApplicationDependencyProvider.php

```php
<?php
 
namespace Pyz\Yves\ShopApplication;
 
use SprykerShop\Yves\MerchantOpeningHoursWidget\Widget\MerchantOpeningHoursWidget;
use SprykerShop\Yves\ShopApplication\ShopApplicationDependencyProvider as SprykerShopApplicationDependencyProvider;
 
class ShopApplicationDependencyProvider extends SprykerShopApplicationDependencyProvider
{
    /**
     * @return string[]
     */
    protected function getGlobalWidgets(): array
    {
        return [
            MerchantOpeningHoursWidget::class,
        ];
    }
}
```

Run the following command to enable Javascript and CSS changes:

```bash
console frontend:yves:build
```

Make sure that the following widget(s) was registered:

| Module    | Test  |
| ------------------ | -------------------- |
| MerchantOpeningHoursWidget | Go to a MerchantPage on the storefront and ensure that merchant working hours are displayed on the page. |

## Related Features

| Feature  | Link   |
| ------------------ | -------------- |
| Merchant Opening Hours API | [[WIP\] GLUE: Merchant Opening Hours Integration - ongoing](http://spryker.atlassian.net/wiki/spaces/DOCS/pages/1950482923) |