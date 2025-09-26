
# US 2.2.2

## 1. Context

*As a Port Authority Officer, I want to register and update vessel records, so that valid vessels can be referenced in visit notifications.*

## 2. Requirements

**US 2.2.2** As a Port Authority Officer, I want to register and update vessel records.

**Acceptance Criteria:**

- Each vessel record must include key attributes such as IMO number, vessel name, vessel type and operator/owner.

- The system must validate that the IMO number follows the official format (seven digits with a check digit), otherwise reject it.


- Vessel records must be searchable by IMO number, name, or operator.


**Dependencies/References:**

*There is a dependency with US2.2.1, since a vessel type must exist so it can be assigned on the record.*


**Forum Insight:**

* Still no questions related to this user story on forum.

## 3. Analysis

Record Registration

![System Sequence Diagram ](images/system-sequence-diagram-US2.2.2.png)

