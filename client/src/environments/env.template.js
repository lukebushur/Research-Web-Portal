(function(window) {
  window["env"] = window["env"] || {};
  // The placeholder ${API_URL} will be replaced by the ECS variable
  window["env"]["apiUrl"] = "${API_URL}";
})(this);
