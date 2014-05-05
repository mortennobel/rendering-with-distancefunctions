var liveEditorId = 0;

function LiveEditor() {
    var thisObj = this;
    this.height = "300px";

    this.mode = "ace/mode/javascript";
    this.title = "Editor";
    this.data = 'function foo(items) {\n'+
        '       var x = "All this is syntax highlighted";\n'+
        '           return x;\n'+
        '       }<test></test>';
    this.noResult = false;
    this.resultTitle = "Result";
    this.wrapperFunction = function(data, updateContent, interactive){
        if (updateContent){
            return data;
        }
        var baseLocation = document.location.href.substring(0,document.location.href.lastIndexOf('/'));
        /*data = data.replace(/\n/g, "\\n");
        data = ''+
//        '<script src="'+baseLocation+'/require.js"></script>'+
        '    <script type="text/javascript">\n'+
        '    var reqOne = require.config({\n'+
        '        paths: {\n'+
        '           kick: "'+baseLocation+'/kick-debug"\n'+
        '        }\n'+
        '    });\n'+
        '\n'+
        '    reqOne(["kick"],\n'+
        '    function (KICK) {\n'+
        '        var engine = new KICK.core.Engine("canvas");\n'+
        (interactive?'':'setTimeout(function(){engine.paused = true;},500);\n')+
        '        var cameraObject = engine.activeScene.createGameObject();\n'+
        '        var camera = new KICK.scene.Camera({\n'+
        '           perspective: false,\n'+
        '           near: -1\n'+
        '        });\n'+
        '        cameraObject.addComponent(camera);\n'+
        '        // create material\n'+
        '        var shader = new KICK.material.Shader();\n'+
        '        shader.vertexShaderSrc = "#version 100\\nattribute vec3 vertex;\\nvoid main(void) {\\ngl_Position = vec4(vertex, 1.0);\\n}";\n'+
        '        shader.fragmentShaderSrc = "'+data+'";\n'+
        '        shader.apply();\n'+
        '        var material = new KICK.material.Material({\n'+
        '           shader: shader,\n'+
        '        });\n'+
        '        // create meshes\n'+
        '        var gameObject = engine.activeScene.createGameObject();\n'+
        '        var meshRenderer = new KICK.scene.MeshRenderer();\n'+
        '        meshRenderer.mesh = engine.project.load(engine.project.ENGINE_MESH_PLANE);\n'+
        '        meshRenderer.material = material;\n'+
        '        gameObject.addComponent(meshRenderer);\n'+
        '        }\n'+
        '    );\n'+
        '    </script>';
        console.log(data);
        // replace scrip_t with script - to allow script like tags within script elements
        return data.replace(/scrip_t/g, "script");
        */
        return data;
    };

    this.build = function(){
        liveEditorId = liveEditorId + 1;
        var id = liveEditorId;
        var data = thisObj.data.trim();

        if (thisObj.noResult){
            document.write('<div class="example-snippet">'+
                '<div class="editor-title">'+thisObj.title+'</div>'+
                '<div id="editor'+id+'" style="height: '+thisObj.height+';"></div>'+
                '   </div>'
                );
        } else {
        document.write('<div class="yui3-g example-snippet">'+
            '<div class="yui3-u-1-2">'+
            '<div class="editor-title">'+thisObj.title+'</div>'+
        '<div id="editor'+id+'" style="height: '+thisObj.height+';"></div>'+
        '   </div>'+
            '   <div class="yui3-u-1-2">'+
                '<div class="editor-title">'+thisObj.resultTitle+'</div>'+
//            '       <iframe id="editor-target'+id+'" style="width: 100%;height: '+thisObj.height+';"></iframe>'+
            '<canvas id="canvas'+id+'" style="border: none;width:100%;height:'+thisObj.height+';"></canvas>'+
            '   </div>'+
            '</div>');
        }



        var requireJs = require.config({
            paths: {
                kick: "./kick"
            }
        });
        requireJs(["kick", "ace/ace"],
            function (KICK, ace) {

                var editor = ace.edit("editor"+id);
                editor.getSession().setUseWorker(false);
                editor.getSession().setMode(thisObj.mode);
                editor.getSession().setValue(thisObj.wrapperFunction(data, true).replace(/\u2028/g, ""));
                if (thisObj.noResult){
                    return;
                }
                var scheduledUpdate;

                var engine = new KICK.core.Engine("canvas"+id);
                var cameraObject = engine.activeScene.createGameObject();
                var camera = new KICK.scene.Camera({
                    perspective: false,
                    near: -1
                });
                cameraObject.addComponent(camera);
                // create material
                var shader = new KICK.material.Shader();
                shader.vertexShaderSrc = "#version 100\nattribute vec3 vertex;\nvoid main(void) {\ngl_Position = vec4(vertex, 1.0);\n}";
                shader.fragmentShaderSrc = "precision highp float;\n\nvoid main(void)\n{\n    gl_FragColor = vec4(1.0,1.0,1.0,1.0);\n}";
                shader.apply();
                var material = new KICK.material.Material({
                    shader: shader
                });
                var updateValue = function(e){
                    var localS = editor.getSession().getValue();
                    if (scheduledUpdate){
                        clearTimeout(scheduledUpdate);
                    }
                    scheduledUpdate = setTimeout(function(){
                        var value = thisObj.wrapperFunction(localS, false);
                        shader.fragmentShaderSrc = value;
                        var res = shader.apply();
                        console.log("Compile shader: "+res, "Value ", value);
                        scheduledUpdate = null;
                    }, 500);

                };
                editor.on("change" , updateValue );
                updateValue();
                // create meshes
                var gameObject = engine.activeScene.createGameObject();
                var meshRenderer = new KICK.scene.MeshRenderer();
                meshRenderer.mesh = engine.project.load(engine.project.ENGINE_MESH_PLANE);
                meshRenderer.material = material;
                gameObject.addComponent(meshRenderer);
            }
        );
    };

    return this;
}