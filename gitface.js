(function(){
  
  var gitfaces,
    baseUrl = "http://github.com/api/v2/json/repos/show/";

  function totalCommits(contributors) {
    var out = 0;

    $.each(contributors, function(index, contributor) {
      out += contributor.contributions
    });
    return out;
  }

  function process(response) {
    gitfaces.empty();
    var totalCommitCount = totalCommits(response.contributors);
    var biggestCommitCount = response.contributors[0].contributions;

    $.each(response.contributors, function(index, contributor) {
      var div = $("<a/>",{
        className: "gitface",
        href: "https://github.com/"+contributor.login,
        target: "_blank"
      });
      
      // the bar
      var imageUrl = "http://www.gravatar.com/avatar/"+contributor.gravatar_id+"?s=30";

      var bar = $('<div/>', {
        className: 'bar',
        style: "background-image: url('" + imageUrl + "'); " + 
               "height: " + 500 * contributor.contributions/biggestCommitCount + 'px'
      });
      div.append(bar);

      // // the number of contributions
      // div.append($("<span/>",{ className: "contributions", text: contributor.contributions }));

      // // the username
      // div.append($("<span/>",{ className: "login", text: contributor.login }));

      // throw it in
      gitfaces.append(div);
    });
    gitfaces.css({width: response.contributors.length * 30});
  }
  
  // process the github response
  function wasProcess(response) {
    gitfaces.empty();
    $.each(response.contributors, function(index, contributor) {
      var div = $("<a/>",{
        className: "gitface",
        href: "https://github.com/"+contributor.login,
        target: "_blank"
      });
      // the image
      div.append($("<img/>",{
        src: "http://www.gravatar.com/avatar/"+contributor.gravatar_id+"?s=512"
      }));
      // the number of contributions
      div.append($("<span/>",{ className: "contributions", text: contributor.contributions }));
      // the username
      div.append($("<span/>",{ className: "login", text: contributor.login }));
      // throw it in
      gitfaces.append(div);
    });
    resizeImages();
  }
  
  function loadEarl() {
    var match = window.location.hash.match(/#\/(\w+)\/(\w+)/),
      user = match[1],
      repo = match[2];
      
    $.getJSON(baseUrl+user+"/"+repo+"/contributors?callback=?").success(process);
  }
  
  function resizeImages() {
    newSize = $(window).width() / 4;
    $(".gitface > img").height(newSize).width(newSize);
    $(".gitface").css({height: newSize, width: newSize});
  }
  
  $(document).ready(function(){
    gitfaces = $("#gitfaces");
    
    var input = $("#addressbar input"),
      _input = input[0];
    
    input.focus(function(){
      input.addClass("typing");
      if(input.val() == _input.defaultValue) {
        input.val("");
      }
    }).blur(function(){
      if(input.val().match(/^$|^[\s]+$/)) {
        input.removeClass("typing");
        input.attr("value",_input.defaultValue);
      }
    });
    
    $("form").submit(function(event){
      event.preventDefault();
      (input.val().match(/(\w+)\/(\w+)/)) ?
        window.location.href = "#/"+input.val() :
        alert("That doesn't look like a github repo url");
    });
    
    // address handling
    $.address.change(loadEarl);
    
    $(window).resize(resizeImages);
  });
  
})();
