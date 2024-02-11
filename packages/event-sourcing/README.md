# CQRS pattern

CQRS pattern is great for apps where write data and read data look very different. 
Imagine a case where a team is responsible for adding items present in the Warehouse. 
The data that is shown for the Warehouse team is significantly different then the data shown to a customer.
We need to do a lot of complex queries to get the data and show it in warehouse app. 
In that case it makes sense to have a different db which stores the read data for the warehouse. 


CQRS pattern is good for task based applications. Not every app needs this pattern. 


RabbitMq can visualised at this url - http://localhost:15672/#/