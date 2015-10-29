/**
 * This file is part of OpenMediaVault.
 *
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    Volker Theile <volker.theile@openmediavault.org>
 * @author    OpenMediaVault Plugin Developers <plugins@omv-extras.org>
 * @copyright Copyright (c) 2009-2015 Volker Theile
 * @copyright Copyright (c) 2015 OpenMediaVault Plugin Developers
 *
 * OpenMediaVault is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * OpenMediaVault is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OpenMediaVault. If not, see <http://www.gnu.org/licenses/>.
 */

// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/form/Panel.js")
// require("js/omv/form/field/SharedFolderComboBox.js")

Ext.define("OMV.module.admin.service.mpd.Settings", {
    extend: "OMV.workspace.form.Panel",
    requires: [
                "OMV.form.field.SharedFolderComboBox"
    ],

    rpcService: "Mpd",
    rpcGetMethod: "getSettings",
    rpcSetMethod: "setSettings",
    plugins: [{
                ptype: "linkedfields",
                correlations: [{
                      name: [ "bind_to_address", "port", "log_level" ],
                      conditions: [
                        { name: "enable", value: true }
                      ],
                      properties: [
                        "!allowBlank",
                        "!readOnly"
                      ]
                    },{
                      name: "password",
                      conditions: [
                        { name: "password_required", value: true }
                      ],
                      properties: [
                        "!allowBlank",
                        "!readOnly"
                      ]
                    },{
                      name: [ "music_directory", "auto_update", "follow_outside_symlinks", "follow_inside_symlinks" ],
                      conditions: [
                        { name: "enable_music_dir", value: true }
                      ],
                      properties: [
                        "!allowBlank",
                        "!readOnly"
                      ]
                    },{
                      name: [ "playlist_directory", "save_absolute_paths_in_playlists" ],
                      conditions: [
                        { name: "enable_playlist_dir", value: true }
                      ],
                      properties: [
                        "!allowBlank",
                        "!readOnly"
                      ]
                    },{
                      name: [ "replaygain", "replaygain_preamp", "replaygain_missing_preamp", "replaygain_limit" ],
                      conditions: [
                        { name: "enable_replaygain", value: true }
                      ],
                      properties: [
                        "!allowBlank",
                        "!readOnly"
                      ]
                    },{
                      name: [ "enable", "enable_music_dir" ],
                      conditions: [
                        { name: "enable", value: true },
                        { name: "enable_music_dir", value: true }
                      ],
                      properties: function(valid, field) {
                                    this.setButtonDisabled("updatedb", !valid);
                                  }
                    }
                ]
    }],

    getButtonItems : function() {
        var me = this;
        var items = me.callParent(arguments);
        items.push({
            id       : me.getId() + "-updatedb",
            xtype    : "button",
            text     : _("Update database"),
            icon     : "images/search.png",
            iconCls  : Ext.baseCSSPrefix + "btn-icon-16x16",
            disabled : true,
            scope    : me,
            handler  : function() {
              // Display waiting dialog
              OMV.MessageBox.wait(null, _("Initiating update of MPD database ..."));
              // Execute RPC.
              OMV.Rpc.request({
                  scope       : this,
                  callback: function(id, success, response) {
                    OMV.MessageBox.updateProgress(1);
                    OMV.MessageBox.hide();
                    if (success) {
                      OMV.MessageBox.success(null, _("MPD database update triggered. This may take some time to complete."));
                    } else {
                      OMV.MessageBox.error(null, response);
                    }
                  },
                  relayErrors : true,
                  rpcData     : {
                      service  : "Mpd",
                      method   : "doUpdateDb"
                  }
              });
            }
        });
        return items;
    },

    getFormItems: function() {
        return [{
            xtype: "fieldset",
            title: _("General settings"),
            defaults: {
                labelSeparator: ""
            },
            items: [{
                    xtype: "checkbox",
                    name: "enable",
                    fieldLabel: _("Enable"),
                    checked: false
                },{
                    xtype         : "textfield",
                    name          : "bind_to_address",
                    fieldLabel    : _("Address"),
                    allowBlank    : false,
                    value         : "any",
                		plugins: [{
                			ptype: "fieldinfo",
                			text: _("IP address or hostname that MPD listens on. Use 'any' to listen on all available addresses.")
                		}]
                },{
                    xtype: "numberfield",
                    name: "port",
                    fieldLabel: _("Port"),
                    vtype: "port",
                    minValue: 1,
                    maxValue: 65535,
                    allowDecimals: false,
                    allowBlank: false,
                    value: 6600,
                    plugins: [{
                            ptype: "fieldinfo",
                            text: _("Port to listen on. The default is 6600.")
                    }]
                },{
                    xtype      : "combo",
                    name       : "log_level",
                    fieldLabel : _("Log Level"),
                    mode       : "local",
                    store      : new Ext.data.SimpleStore({
                        fields  : [ "value", "text" ],
                        data    : [
                            [ "default", _("Default") ],
                            [ "secure", _("Secure") ],
                            [ "verbose", _("Verbose") ]
                        ]
                    }),
                    displayField  : "text",
                    valueField    : "value",
                    allowBlank    : false,
                    editable      : false,
                    triggerAction : "all",
                    value         : "default",
                		plugins: [{
                        ptype: "fieldinfo",
                        text: _("Type of information to log. 'Default' is minimal logging, 'secure' reports the addresses of connections when they are opened and closed, and 'verbose' records excessive amounts of information for debugging purposes.")
                    }]
                }
              ]
            },{
              xtype: "fieldset",
              title: _("Music files and directories"),
              defaults: {
                  labelSeparator: ""
              },
              items: [{
                  xtype: "checkbox",
                  name: "enable_music_dir",
                  fieldLabel: _("Enable"),
                  checked: false,
                  boxLabel: _("If you do not configure this you can only play streams.")
                },{
                  xtype: "sharedfoldercombo",
                  name: "music_directory",
                  fieldLabel: _("Shared Folder"),
                  allowNone: true,
                  plugins: [{
                      ptype: "fieldinfo",
                      text: _("Shared Folder containing music files.")
                  }]
                },{
				          xtype: "checkbox",
                  name: "auto_update",
                  fieldLabel: _("Auto update"),
                  checked: true,
                  boxLabel: _("Automatically update MPD's database when files in the music directory are changed (if disabled use the 'update database' button above).")
			          },{
                  xtype: "fieldset",
                  title: _("Symbolic link behaviour"),
                  defaults: {
                    labelSeparator: ""
                  },
                  items: [{
                      xtype: "checkbox",
                      name: "follow_outside_symlinks",
                      checked: true,
                      boxLabel: _("Enable MPD to discover files by following symlinks outside of the configured music directory.")
                    },{
                      xtype: "checkbox",
                      name: "follow_inside_symlinks",
                      checked: true,
                      boxLabel: _("Enable MPD to discover files by following symlinks inside of the configured music directory.")
                    }
                  ]
                }
              ]
            },{
                xtype: "fieldset",
                title: _("Playlists"),
                defaults: {
                    labelSeparator: ""
                },
                items: [{
                  xtype: "checkbox",
                  name: "enable_playlist_dir",
                  fieldLabel: _("Enable"),
                  checked: false,
                  boxLabel: _("If you do not configure this, you cannot save playlists.")
                },{
                  xtype: "sharedfoldercombo",
                  name: "playlist_directory",
                  fieldLabel: _("Shared Folder"),
                  allowNone: true,
                  plugins: [{
                      ptype: "fieldinfo",
                      text: _("Shared Folder for storing playlists.")
                  }]
                },{
                  xtype: "checkbox",
                  name: "save_absolute_paths_in_playlists",
                  fieldLabel: _("Absolute paths"),
                  checked: false,
                  boxLabel: _("Enables MPD to create playlists in a format usable by other music players.")
                }
              ]
            },{
              xtype: "fieldset",
              title: _("Authentication"),
              defaults: {
                  labelSeparator: ""
              },
              items: [{
                      xtype: "checkbox",
                      name: "password_required",
                      fieldLabel: _("Enable"),
                      checked: false,
                      boxLabel: _("Require a password to access and control MPD.")
                    },{
                      xtype: "passwordfield",
                      name: "password",
                      fieldLabel: _("Password"),
                      allowBlank: true
                    }
              ]
            },{
              xtype: "fieldset",
              title: _("Playback"),
              defaults: {
                  labelSeparator: ""
              },
              items: [{
                        xtype: "checkbox",
                        name: "volume_normalization",
                        fieldLabel: _("Volume normalization"),
                        checked: false,
                        boxLabel: _("On-the-fly normalization volume adjustment is used to make all audio output have equal 'loudness'.")
                    },{
                        xtype: "checkbox",
                        name: "gapless_mp3_playback",
                        fieldLabel: _("Gapless MP3 playback"),
                        checked: true,
                        boxLabel: _("If you have a problem with MP3s ending abruptly, try disabling this setting.")
                    },{
                        xtype: "numberfield",
                        name: "buffer_before_play",
                        fieldLabel: _("Buffer size"),
                        minValue: 0,
                        maxValue: 100,
                        allowDecimals: false,
                        allowBlank: false,
                        value: 10,
                        plugins: [{
                                ptype: "fieldinfo",
                                text: _("Percentage of the buffer which is filled before beginning to play. Increasing this reduces the chance of audio file skipping, at the cost of increased time prior to audio playback.")
                        }]
                    },{
                        xtype: "checkbox",
                        name: "restore_paused",
                        fieldLabel: _("Restore paused"),
                        checked: true,
                        boxLabel: _("Always pause playback when MPD starts. Requires MPD version 0.17 or later.")
                    }
              ]
            },{
              xtype: "fieldset",
              title: _("ReplayGain"),
              defaults: {
                  labelSeparator: ""
              },
              items: [{
                        xtype: "checkbox",
                        name: "enable_replaygain",
                        fieldLabel: _("Enable"),
                        checked: false,
                        boxLabel: _("Automatically adjust the volume of tracks using ReplayGain tags.")
                    },{
                        xtype      : "combo",
                        name       : "replaygain",
                        fieldLabel : _("Tag mode"),
                        mode       : "local",
                        store      : new Ext.data.SimpleStore({
                            fields  : [ "value", "text" ],
                            data    : [
                                [ "auto", _("Auto") ],
                                [ "album", _("Album") ],
                                [ "track", _("Track") ]
                            ]
                        }),
                        displayField  : "text",
                        valueField    : "value",
                        allowBlank    : false,
                        editable      : false,
                        triggerAction : "all",
                        value         : "auto",
                        plugins: [{
                                ptype: "fieldinfo",
                                text: _("'Album' uses the album ReplayGain tag, 'track' uses the track tag, and 'auto' uses the track tag when in random play mode, otherise the album tag.")
                        }]
                  },{
                        xtype: "numberfield",
                        name: "replaygain_preamp",
                        fieldLabel: _("Preamp"),
                        minValue: -15,
                        maxValue: 15,
                        allowDecimals: false,
                        allowBlank: false,
                        value: 0,
                        plugins: [{
                                ptype: "fieldinfo",
                                text: _("Pre-amp (in dB) for tracks that have ReplayGain tags.")
                        }]
                  },{
                        xtype: "numberfield",
                        name: "replaygain_missing_preamp",
                        fieldLabel: _("non-ReplayGain preamp"),
                        minValue: -15,
                        maxValue: 15,
                        allowDecimals: false,
                        allowBlank: false,
                        value: 0,
                        plugins: [{
                                ptype: "fieldinfo",
                                text: _("Pre-amp (in dB) for tracks that do not have ReplayGain tags.")
                        }]
                  },{
                        xtype: "checkbox",
                        name: "replaygain_limit",
                        fieldLabel: _("Limit"),
                        checked: true,
                        boxLabel: _("If enabled, MPD will never amplify an audio signal above its original level.")
                  }
            ]
        },{
          xtype: "fieldset",
          title: _("Extra options"),
          items: [{ xtype: "textarea",
                    name: "extra_options",
                    allowBlank: true,
                    flex: 1,
                    plugins: [{
                            ptype: "fieldinfo",
                            text: _("Enter any additional configuration settings here directly. Please see the <a href='http://www.musicpd.org/doc/user/' target='_blank'>MPD user's manual</a> for more details."),
                    }]
                  }]
        }
      ];
    }
});

OMV.WorkspaceManager.registerPanel({
    id: "settings",
    path: "/service/mpd",
    text: _("Settings"),
    position: 10,
    className: "OMV.module.admin.service.mpd.Settings"
});
