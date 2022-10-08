Problem: There is currently no way to send commands to a specific rmtCtrl node in the RhymeSync Network. Sending a command send it to all the nodes connected to the network, which is not ideal.
Fix: Have a way of identifiying nodes that belong to a specific program (Idealy by the server without pinging every node.)
Implementation:
	1) Have rmtCtrl nodes (and other nodes of programs) register which program they belong to (in this case it'd be "rmtCtrl") to the server upon handshake.
	2) Ask the Server to return a list of nodes that belong to that program. Kinda like what "getActiveSocketList" does, but it excludes all the nodes that are foreign to the specified program.
	3) Have the user chose which
---
SideFix1: Along with the aforementioned Fix. It'd also be nice to, have the RhymeSyncServer contain different different "groups". Emmisions in a group will not interfere with the rest of the network.
	Recievers can opt-into these groups, and they'll only get emmisions made from other nodes of the same group.
	(Nodes is a group will still be discoverable through the in the "getActiveSocketList" command, and will not be excluded from "sendDataToSpecificID" emmisions originating from outside the group.)
SideFix1 Result: This should reduce bandwidth wastage, and reduce the load on the client. This'll also allow us to simulate multiple different RhymeSyncServers with only one host.
	Instead of hosting multiple instances of RhymeSyncServer, one server instance with grouping will yield the same result.