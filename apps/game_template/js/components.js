var data = {"players":[{"id":0},{"id":1}],"pieces":{"pieces":[{"id":0,"player":0,"startPositionX":0,"startPositionY":0,"startState":"isOffBoard","type":"cross","image":"images\/pieces\/cross.png"},{"id":1,"player":0,"startPositionX":0,"startPositionY":0,"startState":"isOffBoard","type":"cross","image":"images\/pieces\/cross.png"},{"id":2,"player":0,"startPositionX":0,"startPositionY":0,"startState":"isOffBoard","type":"cross","image":"images\/pieces\/cross.png"},{"id":3,"player":0,"startPositionX":0,"startPositionY":0,"startState":"isOffBoard","type":"cross","image":"images\/pieces\/cross.png"},{"id":4,"player":1,"startPositionX":0,"startPositionY":0,"startState":"isOffBoard","type":"oval","image":"images\/pieces\/oval.png"},{"id":5,"player":1,"startPositionX":"0","startPositionY":"0","startState":"isOffBoard","type":"oval","image":"images\/pieces\/oval.png"},{"id":6,"player":1,"startPositionX":0,"startPositionY":0,"startState":"isOffBoard","type":"oval","image":"images\/pieces\/oval.png"},{"id":7,"player":1,"startPositionX":0,"startPositionY":0,"startState":"isOffBoard","type":"oval","image":"images\/pieces\/oval.png"}]},"board":{"board":[[{"paths":[3],"type":"yellow","color":"yellow"},{"paths":[3],"type":"yellow","color":"yellow"},{"paths":[2],"type":"yellow","color":"yellow"}],[{"paths":[0],"type":"yellow","color":"yellow"},{"paths":[0],"type":"yellow","color":"yellow"},{"paths":[2],"type":"yellow","color":"yellow"}],[{"paths":[0],"type":"yellow","color":"yellow"},{"paths":[1,0],"type":"yellow","color":"yellow"},{"paths":[1],"type":"yellow","color":"yellow"}]]},"rules":{"rules":[{"id":0,"sensing_object":"slot_2_2","sensing_subobject":"on_land","sensing_action":"has","sensing_action_modifier":"piece_to_move","do_action":"give_turns","do_num_turns":2,"do_action_object":"opposing_player","do_action_subobject":""},{"id":1,"sensing_object":"board","sensing_subobject":"on_land","sensing_action":"has","sensing_action_modifier":"opponent_pieces","do_action":"remove","do_num_turns":null,"do_action_object":"piece","do_action_subobject":"opponent_pieces"},{"id":2,"sensing_object":"slot_1_1","sensing_subobject":"on_land","sensing_action":"has","sensing_action_modifier":"piece_to_move","do_action":"win","do_num_turns":null,"do_action_object":"opposing_player","do_action_subobject":""}]},"moveDecider":"Roll Dice"}