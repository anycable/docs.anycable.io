;(function(win) {
  win.NamespacesPlugin = {}

  function create(opts) {
    let hashMode = true;
    let namespaces = opts.namespaces || [];

    let namespaceRegexps = opts.namespaces.map((namespace) => {
      let base = `(?:(${namespace.values.join("|")})/)`

      if(namespace.optional) base += "?";

      return base;
    });

    let namespacesRegexp = new RegExp(`^#?/${namespaceRegexps.join("")}`);

    let currentNamespace;

    const goToUrl = function(url) {
      if (hashMode) {
        window.location.hash = url
      } else {
        window.location.href = url;
      }
    };

    const getUrlParts = function(url){
      if (!url) url = hashMode ? window.location.hash : window.location.pathname;

      return url.split(/\//);
    };

    const updateUrlNamespace = function(urlParts, namespace, index, val) {
      // Namespace already exists => replace it
      if (namespace.values.includes(urlParts[index + 1])) {
        if (val) {
          urlParts[index + 1] = val
        } else {
          urlParts.splice(index + 1, 1);
        }
      } else {
        if (val) {
          urlParts.splice(index + 1, 0, val);
        }
      }
    };

    const openNamespace = function(val, index) {
      let parts = getUrlParts();

      updateUrlNamespace(parts, namespaces[index], index, val);

      const url = parts.join("/");

      goToUrl(url);
    };

    const namespaceSidebarLinks = function(html) {
      if (!currentNamespace) return html;

      const namespaceRx = new RegExp("^" + currentNamespace);

      html = html.replace(/(href=['"])(#?[^'"]+)(["'])/g, function(match, prefix, path, suffix){
        // Already namespaced links
        if (path.match(namespaceRx)) return match;

        path = path.replace(/^#?\//, currentNamespace);

        return [prefix, path, suffix].join("");
      });

      return html;
    };

    return function(hook, vm) {
      hook.mounted(function(){
        hashMode = vm.router.mode == "hash";

        let parts = getUrlParts();
        // Only load default namespace for root path
        let loadDefault = (parts.length == 2) && parts[1] == "";

        namespaces.forEach((namespace, index) => {
          if (!namespace.selector) return;

          namespace.selectElement = Docsify.dom.find(namespace.selector);

          if (namespace.default) {
            namespace.selectElement.value = namespace.default;

            // Only update parts if no explicit namespace is provided
            if (!namespace.values.includes(parts[index + 1])) {
              updateUrlNamespace(parts, namespace, index, namespace.default);
            }
          }

          // Prevent aside from closing in mobile view
          Docsify.dom.on(namespace.selectElement, "click", function (e) { return e.stopPropagation(); });

          // Handle select changes
          Docsify.dom.on(namespace.selectElement, "change", function (e) { return openNamespace(e.target.value, index); });
        });

        // Override sidebar compiler to prefix links with the current namespace
        var origSidebar = vm.compiler.sidebar;

        vm.compiler.sidebar = function() {
          return namespaceSidebarLinks(origSidebar.apply(this, arguments));
        }

        // Load default namespace
        if (loadDefault) goToUrl(parts.join("/"));
      });

      hook.afterEach(function(html, next){
        let url = vm.router.mode == "hash" ? window.location.hash : window.location.pathname;
        let matches = url.match(namespacesRegexp);

        namespaces.forEach((namespace, index) => {
          if (!namespace.selectElement) return;

          namespace.selectElement.value = (matches && matches[index + 1]) || "";
        });

        currentNamespace = matches ? matches[0] : "/";

        next(html);
      });
    }
  }

  win.NamespacesPlugin.create = create
}) (window)
