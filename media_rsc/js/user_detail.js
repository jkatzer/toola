(function() {
  
  var UserDetail = function() {
    $('#add_toolbox').click(UserDetail.showCreateToolbox);
    $('#create-toolbox-inline-save').click(UserDetail.saveToolbox);
    $('#create-toolbox-inline-close').click(UserDetail.closeCreateToolbox);
  };
  
  UserDetail.showCreateToolbox = function() {
    var toolboxName = $('#id_toolbox_name')[0].value = '';
    var tools = $('#id_tools')[0].value = '';
    $('#overlay').css('height', document.body.clientHeight);
    $('#overlay').css('display', 'block');
    UserDetail.centerBox('#create-toolbox-inline');
    $('#create-toolbox-inline').fadeIn("fast");
  };
  
  UserDetail.closeCreateToolbox = function() {
    $('#overlay').css('display', 'none');
    $('#create-toolbox-inline').fadeOut("slow");
  };

  UserDetail.saveToolbox = function() {
    var toolboxName = $('#id_toolbox_name')[0].value;
    var tools = $.trim($('#id_tools')[0].value);
    var userProfile = $('#user-profile-id')[0].value;
    
    $.ajax({
      url: 'http://localhost/colorific/proxy/toolbox/',
      type: "GET",
      data: 'toolbox_name=' + toolboxName + '&tools=' + tools + '&userprofile_id=' + userProfile,
      success: function(json) {
        if (json.result === "ok") {
          UserDetail.closeCreateToolbox();
          UserDetail.updatelistToolbox();
        } else {
          alert("A System error has occurred, please try again");
        }
      },
      error: function(obj) {
        alert(obj.status + " => " + obj.statusText)
      }
    });
  }

  UserDetail.updatelistToolbox = function() {
    $.ajax({
      url: 'http://localhost:80/colorific/proxy/toolboxes/',
      type: "GET",
      success: function(json) {
        json = $.parseJSON(json);
        
        var toolboxesList = [];
        for (key in json) {
          var toolList = [];
          toolboxesList.push('<div class="toolBoxModuleTabular span-14 last">');
          toolboxesList.push('<div id="stats" class="span-2">');
          toolboxesList.push('100');
          toolboxesList.push('<br />');
          toolboxesList.push('TIGS');
          toolboxesList.push('</div>');
          toolboxesList.push('<div id="toolbox" class="span-11 last">')
          toolboxesList.push('<span class="toolBoxTitleSmall">'+ json[key].toolbox_name + '</span>');
          toolboxesList.push('<div>');
          for (key2 in json[key].tools) {
            toolList.push(json[key].tools[key2].tool_name);
          }
          toolboxesList.push(toolList.join(', '));
          toolboxesList.push('</div>');
          toolboxesList.push('</div>');
          toolboxesList.push('</div>');
        }
        
        var results = document.createElement('div');
        results.innerHTML = toolboxesList.join('');
        $('#toolboxes')[0].innerHTML = ''
        $('#toolboxes')[0].appendChild(results);
        $('#toolboxes')[0].fadeIn("slow");
      },
      error: function(obj) {
        alert(obj.status + " => " + obj.statusText)
      }
    });
  }
  
  UserDetail.centerBox = function(divId) {
    var divObj = $(divId);
    if (divObj) {
      screenW = (document.body.clientWidth) ? document.body.clientWidth : window.innerWidth;
      screenH = (document.body.clientHeight) ? document.body.clientHeight : window.innerHeight;
      
      divH = parseInt(divObj.css('height'));
      if (!divH) {
        divH = divObj.offsetHeight;
      }
      
      divObj.css('top', 250);
      divObj.css('left', (screenW/2) - (parseInt(divObj.css('width'))/2));
    } 
  };
  
  new UserDetail();
  
}());

$(function() {
                
    function split(val) {
        return val.split(/,\s*/);
    }
    function extractLast(term) {
        return split(term).pop();
    }
    
    $("#id_tools").autocomplete({
        minLength: 1,
        delay: 0,
        source: function(request, response) {
            $.getJSON(
              "/colorific/get_suggestions/",
              {term : extractLast(request.term)},
               response);
        },
        search: function() {
            var term = extractLast(this.value);
            if (term.length < 2) {
                return false;
            }
        },
        focus: function() {
            return false;
        },
        select: function(event, ui) {
            var terms = split( this.value );
            terms.pop();
            terms.push( ui.item.value );
            terms.push("");
            this.value = terms.join(", ");
            return false;
        },
    });
});
