var BaseLevel = (function (_super) {
    __extends(BaseLevel, _super);
    function BaseLevel(jsonPath) {
        var _this = this;
        _super.call(this);
        this.jsonPath = jsonPath;
        this.enemies = [];
        this.paths = {};
        this.onprogress = function () {
        };
        this.oncomplete = function () {
        };
        this.onerror = function () {
        };
        /**
        * Factories for creating objects from Tiled map data. In Tiled, when you
        * place an object, you can specify it's Type. The type name gets mapped
        * to this hash. If it exists, the function is called with the the IObject
        * interface.
        */
        this._objectFactories = { };
    }
    BaseLevel.prototype.onInitialize = function (engine) {
        var _this = this;
        this.map = new ex.TileMap(0, 0, this.data.tilewidth, this.data.tileheight, this.data.height, this.data.width);
        // this.heartSprite = new ex.Sprite(Resources.Heart, 0, 0, 20, 20);

        // create collision map for each tileset in map
        this.data.tilesets.forEach(function (ts) {
            var cols = Math.floor(ts.imagewidth / ts.tilewidth);
            var rows = Math.floor(ts.imageheight / ts.tileheight);
            var ss = new ex.SpriteSheet(ts.texture, cols, rows, ts.tilewidth, ts.tileheight);

            // // nighty night!
            // ss.sprites.forEach(function (s) {
            //     return s.addEffect(new Fx.Multiply(Palette.ColorNightTime));
            // });

            _this.map.registerSpriteSheet(ts.firstgid.toString(), ss);
        });

        var i, j, gid, layer, tileset;
        for (i = 0; i < this.data.layers.length; i++) {
            layer = this.data.layers[i];

            // terrain layer?
            if (layer.type === "tilelayer") {
                for (j = 0; j < layer.data.length; j++) {
                    gid = layer.data[j];
                    if (gid !== 0) {
                        tileset = this.getTilesetForTile(gid);

                        if (tileset) {
                            this.map.data[j].sprites.push(new ex.TileSprite(tileset.firstgid.toString(), gid - tileset.firstgid));
                            this.map.data[j].solid = this.map.data[j].solid || this.isTileSolid(gid, layer, tileset);
                        }
                    }
                }
            }

            // object layer
            if (layer.type === "objectgroup") {
                layer.objects.forEach(function (obj) {
                    if (obj.type && _this._objectFactories[obj.type]) {
                        _this._objectFactories[obj.type](obj);
                    }
                });
            }
        }

        // // resolve the associations between enemies and paths
        // this.resolveEnemyPaths();

        // Add collision maps to scene
        this.addTileMap(this.map);
    };

    BaseLevel.prototype.onDeactivate = function () {
        _super.prototype.onDeactivate.call(this);

        // // stop sounds
        // Resources.SoundWaves.stop();
    };

    BaseLevel.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);

        // // kill enemies
        // this.enemies = this.enemies.filter(function (enemy) {
        //     return !enemy._isKilled;
        // });

        // var levelWidth = this.data.width * this.data.tilewidth;
        // var levelHeight = this.data.height * this.data.tileheight;

        // if ((this.kraken.x < 0) || (this.kraken.x > levelWidth) || (this.kraken.y < 0) || (this.kraken.y > levelHeight)) {
        //     //console.log("victory!");
        //     game.goToScene("victory");
        // }
    };

    //TODO overload draw: draw HUD, UI, etc.
    BaseLevel.prototype.draw = function (ctx, delta) {
        _super.prototype.draw.call(this, ctx, delta);

        // // draw HUD, UI, etc.
        // ctx.restore();
        // var krakenHealth = game.currentScene.kraken.health;
        // var numHearts = Math.floor(krakenHealth / 10);

        // for (var i = 0; i < numHearts; i++) {
        //     this.heartSprite.draw(ctx, (this.heartSprite.width + 5) * i + 10, 10);
        // }
        // ctx.save();
        // game.camera.update(0);
    };

    BaseLevel.prototype.load = function () {
        var _this = this;
        var complete = new ex.Promise();
        var request = new XMLHttpRequest();
        request.open("GET", this.jsonPath, true);

        request.onprogress = this.onprogress;
        request.onerror = this.onerror;
        request.onload = function (e) {
            _this.data = JSON.parse(request.response);

            var promises = [];

            // retrieve images from tilesets and create textures
            _this.data.tilesets.forEach(function (ts) {
                ts.texture = new ex.Texture(ts.image);
                ts.texture.oncomplete = ts.texture.onerror = function () {
                    var idx = promises.indexOf(ts.texture);
                    promises.splice(idx, 1);

                    if (promises.length === 0) {
                        _this.oncomplete();
                        complete.resolve(_this.data);
                    }
                };
                promises.push(ts.texture);
            });

            promises.forEach(function (p) {
                return p.load();
            });
        };
        request.send();
        return complete;
    };

    BaseLevel.prototype.isLoaded = function () {
        return this.data !== undefined;
    };

    BaseLevel.prototype.resolveEnemyPaths = function () {
        // var _this = this;
        // this.enemies.forEach(function (enemy) {
        //     if (enemy.key && _this.paths[enemy.key]) {
        //         enemy.createMovePath(_this.paths[enemy.key]);
        //     }
        // });
    };

    BaseLevel.prototype.getTilesetForTile = function (gid) {
        for (var i = this.data.tilesets.length - 1; i >= 0; i--) {
            var ts = this.data.tilesets[i];

            if (ts.firstgid <= gid) {
                return ts;
            }
        }

        return null;
    };

    BaseLevel.prototype.isTileSolid = function (gid, layer, tileset) {
        if (gid === 0)
            return false;

        var solidTerrains = [], i, terrain;

        if (tileset.terrains) {
            for (i = 0; i < tileset.terrains.length; i++) {
                // check for solid terrains
                terrain = tileset.terrains[i];
                if (terrain.properties && terrain.properties.solid === "false") {
                    continue;
                }

                solidTerrains.push(i);
            }
        }

        // todo individual tile overrides layer
        // layers > terrain
        if (layer.properties && layer.properties["solid"] === "true") {
            return true;
        }

        // loop through tiles
        if (tileset.tiles) {
            var tile = tileset.tiles[(gid - 1).toString()];

            if (tile && tile.terrain) {
                for (i = 0; i < tile.terrain.length; i++) {
                    // for each corner of terrain, it is not solid if all corners are not solid
                    if (solidTerrains.indexOf(tile.terrain[i]) > -1) {
                        return true;
                    }
                }
            }
        }

        return false;
    };
    return BaseLevel;
})(ex.Scene);