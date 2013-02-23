var playerIDs = ["50344", "51613", "53851", "50858", "50851"]; // std-player id
var showAll = true;
var tournamentid = "78C53563-14AA-4DB2-922B-105B7D8D9DF4";

$.extend({
  getUrlVars: function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name){
    return $.getUrlVars()[name];
  }
});


$(document).ready(function() {
  var tid = $.getUrlVar('tid');
  if (tid == undefined) {
    alert("Specify an tournament-id! Using standard-value:" + tournamentid);
  } else {
    tournamentid = tid;
  }
  
  showAll = (!($.getUrlVar('visible') == "false"));
  
  showCurrentPlayers(tournamentid);
  var player = $.getUrlVar('pids');
  if (player != undefined) {
    player = decodeURIComponent(player);
    playerIDs = jQuery.parseJSON(player);
  }
});
setInterval(function() {
  showCurrentPlayers(tournamentid);
}, 10000);

//! Add row with tournament name to the result table
function printTournamentName(tnname) {
	if ($('#headRow').length == 0) { 
		console.log("Tournamentname is: " + tnname)	  		  
		$("#tableResult").append(
			$('<tr>')
				.attr('id', 'headRow')
				.append(
					$('<th>')
						.attr('colspan', '6')
						.text(tnname)
				)
		)
	}
}

//! Add game/court row to the result table
function printRow(index) {
	if ($('#row' + index).length == 0) { 
		$("#tableResult").append(
			$('<tr>')
				.attr('id', 'row' + index)
				.append(
					$('<td>')
						.attr('id', 'field_'+index)
            .attr('class', 'field'))
						.append(
            $('<td>')
              .attr('id', 'teams_' + index)
              .attr('class', 'teamcol'))  
          .append(
            $('<td>')
              .attr('id', 'set1_' + index)
              .attr('class', 'set')
              .html('0<br/>0'))
          .append(
            $('<td>')
              .attr('id', 'set2_' + index) 
              .attr('class', 'set')
              .html('0<br/>0'))
          .append(
            $('<td>')
              .attr('id', 'set3_' + index) 
              .attr('class', 'set')
              .html('0<br/>0'))
          .append(
            $('<td>')
              .attr('id', 'dur_' + index)
              .attr('class', 'duration')
              .text('Dur:'))  
            ) 
  }
}

// set all set result to zero
function resetSetResult(index) {
	for (var i = 1; i <= 3; i++) {
		$('#set' + i + '_' + index).html('00<br/>00');
		$('#set' + i + '_' + index).css('font-weight', 'normal');
	} 
}

// create team name
function buildTeamName(p1, p2) {
	return (p2 != "") ? p1 + "/" + p2 : p1;
}

function getDate(offset){
  var now = new Date();
  var hour = 60*60*1000;
  var min = 60*1000;
  return new Date(now.getTime() + (now.getTimezoneOffset() * min) + (offset * hour));
}

// add a debug row
function createDebugRow() {
  $("#tableResult").append(
    $('<tr>')
      .attr('id', 'debug')
      .append(
    		$('<td>')
        	.attr('colspan', '6')
          .attr('id', 'debugInfo')));
}


// get the current livescore and update the result table
function showCurrentPlayers(tournamentid) {
  // get the livescore
	var urlencoded = "livescore.php?tid=" + tournamentid;
	$.ajax({
		type: "GET",
		url: urlencoded,
		dataType: "xml",
		success: function(xml) {
			$("#tableResult").empty();
			var tn = $(xml).find('TN').text();
			printTournamentName(tn);
		  
			var index = 0;
			var visibleRows = 0;
			$(xml).find('C').each(function(){
				index += 1;
				var id = $(this).find('N').text();
				// get the player names and build the "team" name
				var team1_p1 = $(this).find('T1').find('P1').text();  
				var team1_p2 = $(this).find('T1').find('P2').text();
				var team2_p1 = $(this).find('T2').find('P1').text();  
				var team2_p2 = $(this).find('T2').find('P2').text();
				var team1 =  buildTeamName(team1_p1, team1_p2);
				var team2 =  buildTeamName(team2_p1, team2_p2);
				// print the basis row
				printRow(index);
				// get the player ids
				var jResult = [$(this).find("T1").find("P1MEMID").text(),
									$(this).find("T1").find("P2MEMID").text(),
									$(this).find("T2").find("P1MEMID").text(),
									$(this).find("T2").find("P2MEMID").text()];	  
				  
				if ((jResult[0] != "") || (jResult[2] != "")) {
				  // print all player ids to the log
          console.log("Player-IDs:   "+ 
                      jResult[0] + ", " + 
                      jResult[1] + ", " + 
                      jResult[2] + ", " + 
                      jResult[3]);
        }
				// filter, if the searched player is in the game
				var foundPlayerId = false;
				for (var i = 0; i < playerIDs.length; i++) {
					if (jQuery.inArray(playerIDs[i], jResult) != -1) {
							foundPlayerId = true;
							$('#row' + index).addClass('filtered');
							visibleRows += 1;
							break;
						}
				}
				// hide the row and break
				if (foundPlayerId == false) {
					$('#row' + index).removeClass('filtered');
					if (!showAll) {
            $('#row' + index).hide();
            return;
          }
				}
				// display the game information
				$('#field_' + index).html(id); 
				$('#teams_' + index).html(team1 + '<br/>' + team2);
				$('#dur_' + index).html('D:' + $(this).find('D').text());
			
				resetSetResult(index);
				var set = 0;   
				// go through all set results
				$(this).find('SCS').each(function(){
				  set += 1;
				  var result = "";
				  // go through the scores in each set and save the last result
				  var last = $(this).find('SC').each(function() {
					var t1 = $(this).attr('T1'); 
					var t2 = $(this).attr('T2');
					result = t1 + '<br/>' + t2;          
				  });
				  // show the last result
				  $('#set' + set + '_' + index).html(result); 
				}); 
				$('#set' + set + '_' + index).css('font-weight', 'bold');
			});
			
			// Display nothing, if there is no matching player on court
			if (visibleRows == 0) {
				if (!showAll) {
				$("#debug").show();
    				var dateCET = getDate(1);
    				
    			  $("#tableResult").append(
        			$('<tr>')
        				.attr('id', 'debug')
        				.append(
        					$('<td>')
        						.attr('colspan', '6')
                    .attr('id', 'debugInfo')));
            $("#debugInfo").html("Update ausgeführt. Keiner der ausgewählten    Spieler spielt! Updatezeit: " + dateCET);
        }                                				
			} else {
  				$("#debug").hide();			
			}
		},
		// print error message
		error: function(jqXHR, textStatus) {
			var dateCET = getDate(1);
			createDebugRow();
			$("#debugInfo").html("Es kam zu einem Fehler beim Zugriff auf den livescore: " + textStatus + " Uhrzeit: " + dateCET);			
		}
	});
}