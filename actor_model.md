# RFC: Actor Model Prototype

* Primary authors:  @imededin 
* Collaborators: @sambaclab/concept-design  
* Created: *19/10/2023*

# Overview
The aim of this RFC is to discuss the project's design, how to decompose our system into different actors, and discuss the messages that can be exchanged between actors.



# Goals
-  Decompose our system into different actors and consider the messages
- Build a simple architecture of our actor-based system 
- Discuss Actix capabilities and limitations, such as its registry (for actor discovery) functionality.

# Design
The diagram presented below describes the proposed architecture. The system contains six actors exchanging messages. These actors are:

- **ClientSession:**   *The ClientSession actor is a WebSocket actor that represents a client session. This actor receives WebSocket messages from the client, where a message is represented as a string (e.g., '/model/createTable table_name'). The actor also sends messages to the server actor to connect or disconnect the client (adding the client to server sessions). Additionally, it sends messages to the ModelState actor to retrieve information or to add tables and columns.*
- **Server:** The Server actor is responsible for keeping track of the different sessions. It implements handlers for connecting or disconnecting clients, as well as handlers to notify all sessions of any modifications in the model caused by a particular session.
- **ModelState:** The ModelState actor communicates with the Builder actor to create a new table. It also communicates with the TablaState actor to request modifications of the state (e.g., adding columns or deleting columns) and with the ActionHistory actor to store various actions in the model and tables.
- **Builder:** The Builder actor implements a handler to spawn (create) a new TableState actor and return its address.
- **ActionHistory:** The ActionHistory actor keeps track of the history of the model and implements handlers to return the history of a single table in the model or the history of the entire model.
- **TableState**: The TableState actor represent the state of a Table in a model.TableState actors implement handlers for returning the table state, as well as for performing actions such as adding, removing, or modifying columns.
![Diagram](https://github.com/sambaclab/mycorr/assets/78424452/c3ed3f4b-f57c-4cdc-ac72-cb8a3988e554)
