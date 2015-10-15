/**
 * This file is part of OpenMediaVault.
 *
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    Volker Theile <volker.theile@openmediavault.org>
 * @copyright Copyright (c) 2009-2015 Volker Theile
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
// require("js/omv/workspace/grid/Panel.js")
// require("js/omv/workspace/window/Form.js")
// require("js/omv/workspace/window/plugin/ConfigObject.js")
// require("js/omv/Rpc.js")
// require("js/omv/data/Store.js")
// require("js/omv/data/Model.js")
// require("js/omv/data/proxy/Rpc.js")

/**
 * @class OMV.module.admin.service.mpd.AudioOutput
 * @derived OMV.workspace.window.Form
 */
Ext.define("OMV.module.admin.service.mpd.AudioOutput", {
	extend: "OMV.workspace.window.Form",
	requires: [
		"OMV.workspace.window.plugin.ConfigObject"
	],

	rpcService: "Mpd",
	rpcGetMethod: "getAudioOutput",
	rpcSetMethod: "setAudioOutput",
	plugins: [{
		ptype: "configobject"
	}],
	width: 550,

	getFormItems: function() {
		var me = this;
		return [{
					xtype: "fieldset",
					title: _("General settings"),
					items: [{
										xtype: "checkbox",
										name: "enabled",
										fieldLabel: _("Enable"),
										checked: true
									},{
			              xtype: "textfield",
			              name: "name",
			              fieldLabel: _("Name"),
			              allowBlank: false
			            },{
			              xtype: "combo",
			              name: "type",
			              fieldLabel: _("Type"),
										mode       : "local",
					          store      : new Ext.data.SimpleStore({
					              fields  : [ "value", "text" ],
					              data    : [
																		[ "alsa",			_("Advanced Linux Sound Architecture (ALSA)") ],
																		[ "ao",				_("libao") ],
																		[ "fifo",			_("FIFO (First In, First Out) file (raw PCM)") ],
																		[ "jack",			_("Jack Audio Connection Kit (JACK)") ],
																		[ "httpd",		_("HTTP streaming server") ],
																		[ "null",			_("Null (fake)") ],
																		[ "oss",			_("Open Sound System (OSS)") ],
																		[ "openal",		_("OpenAL") ],
																		[ "osx",			_("Mac OS X (Apple CoreAudio)") ],
																		[ "pipe",			_("Pipe (raw PCM)") ],
																		[ "pulse",		_("PulseAudio") ],
																		[ "roar",			_("RoarAudio") ],
																		[ "recorder",	_("Recorder (file, encoded format)") ],
																		[ "shout",		_("ShoutCast") ],
																		[ "solaris",	_("SUN Solaris") ]
					              ]
					          }),
					          displayField  : "text",
					          valueField    : "value",
					          allowBlank    : false,
					          editable      : false,
					          triggerAction : "all",
										value					:	"alsa",
					          plugins: [{
					                  ptype: "fieldinfo",
					                  text: _("The MPD plugin to use for this audio output. Usually ALSA is recommended. Use the 'extra options' field below to configure plugin-specific settings.")
										}]
			            },{
										xtype      : "combo",
					          name       : "format",
					          fieldLabel : _("Format"),
					          mode       : "local",
					          store      : new Ext.data.SimpleStore({
					              fields  : [ "value", "text" ],
					              data    : [
																		[ "*:*:*", 				_("Default (no fixed format)") ],
																		[ "8000:8:1",			_("8,000 Hz, 8-bit, mono (Telephone Quality)") ],
																		[ "16000:16:1",		_("16,000 Hz, 16-bit, mono (Tape Recorder Quality)") ],
																		[ "22050:16:1",		_("22,050 Hz, 16-bit, mono (AM Radio Quality)") ],
																		[ "44100:16:2",		_("44,100 Hz, 16-bit, stereo (CD Quality)") ],
																		[ "48000:16:2",		_("48,000 Hz, 16-bit, stereo (DVD Quality)") ],
																		[ "96000:16:2",		_("96,000 Hz, 16-bit, stereo (Studio Quality)") ],
																		[ "44100:24:2",		_("44,100 Hz, 24-bit, stereo (HDCD Quality)") ],
																		[ "48000:24:2",		_("48,000 Hz, 24-bit, stereo (High-Res Quality)") ],
																		[ "96000:24:2",		_("96,000 Hz, 24-bit, stereo (High-Res Quality)") ],
																		[ "192000:32:2",	_("192,000 Hz, 32-bit, stereo (Studio Quality)") ]
					              ]
					          }),
					          displayField  : "text",
					          valueField    : "value",
					          allowBlank    : false,
					          editable      : false,
					          triggerAction : "all",
					          value         : "*:*:*",
					          plugins: [{
					                  ptype: "fieldinfo",
					                  text: _("Force the output to always be opened with specified audio format, regardless of the input file format. The default is not to do this.")
										}]
			            },{
										xtype: "checkbox",
										name: "always_on",
										fieldLabel: _("Always on"),
										checked: false,
										boxLabel: _("If enabled, MPD attempts to keep this audio output always open. This may be useful for, e.g., streaming servers.")
									},{
										xtype: "checkbox",
										name: "tags",
										fieldLabel: _("Send tags"),
										checked: false,
										boxLabel: _("If enabled, MPD will send tags to this audio output. This is only useful for output plugins that can receive tags, e.g., the httpd plugin.")
									},{
					          xtype      : "combo",
					          name       : "mixer_type",
					          fieldLabel : _("Mixer type"),
					          mode       : "local",
					          store      : new Ext.data.SimpleStore({
					              fields  : [ "value", "text" ],
					              data    : [
					                  [ "hardware", _("Hardware") ],
					                  [ "software", _("Software") ],
														[ "null", _("Null (fake)") ],
					                  [ "none", _("None") ]
					              ]
					          }),
					          displayField  : "text",
					          valueField    : "value",
					          allowBlank    : false,
					          editable      : false,
					          triggerAction : "all",
					          value         : "hardware",
					          plugins: [{
					                  ptype: "fieldinfo",
					                  text: _("Type of mixer to use for adjustment of the audio output volume. The hardware mixer is available for the ALSA, OSS and PulseAudio output plugins. The 'null' mixer allows setting the volume, but with no effect.")
										}]
					      	},{
					          xtype      : "combo",
					          name       : "replaygain_handler",
					          fieldLabel : _("ReplayGain handler"),
					          mode       : "local",
					          store      : new Ext.data.SimpleStore({
					              fields  : [ "value", "text" ],
					              data    : [
					                  [ "software", _("Software") ],
														[ "mixer", _("Mixer") ],
					                  [ "none", _("None") ]
					              ]
					          }),
					          displayField  : "text",
					          valueField    : "value",
					          allowBlank    : false,
					          editable      : false,
					          triggerAction : "all",
					          value         : "software",
					          plugins: [{
					                  ptype: "fieldinfo",
					                  text: _("Specifies how ReplayGain is applied (if enabled). 'Software' uses an internal software volume control, 'mixer' uses the configured (hardware) mixer control, and 'none' disables ReplayGain on this audio output.")
					          }]
					      }
							]
					},{
						xtype: "fieldset",
						title: _("Extra options"),
						items: [{
								xtype: "textarea",
								name: "extra_options",
								allowBlank: true,
								flex: 1,
								plugins: [{
									ptype: "fieldinfo",
									text: _("Enter any additional output configuration settings here directly. Please see the <a href='http://www.musicpd.org/doc/user/' target='_blank'>MPD user's manual</a> for more details.")
								}]
						}]
					}];
			}
});

/**
 * @class OMV.module.admin.service.mpd.AudioOutputs
 * @derived OMV.workspace.grid.Panel
 */
Ext.define("OMV.module.admin.service.mpd.AudioOutputs", {
	extend: "OMV.workspace.grid.Panel",
	requires: [
		"OMV.Rpc",
		"OMV.data.Store",
		"OMV.data.Model",
		"OMV.data.proxy.Rpc"
	],
	uses: [
		"OMV.module.admin.service.mpd.AudioOutput"
	],

	hidePagingToolbar: false,
	stateful: true,
	stateId: "aacaba18-a2e8-4e73-a53d-ff5dc192b9fb",
	columns: [{
		header: _("UUID"),
    hidden: true,
    dataIndex: "uuid"
	},{
    xtype: "booleaniconcolumn",
    header: _("Enabled"),
    sortable: true,
    dataIndex: "enabled",
		stateId: "enabled",
    align: "center",
    width: 80,
    resizable: false,
    iconCls:  Ext.baseCSSPrefix + "grid-cell-booleaniconcolumn-switch"
  },{
    header: _("Name"),
    flex: 1,
    sortable: true,
    dataIndex: "name"
  },{
    header: _("Type"),
    flex: 1,
    sortable: true,
    dataIndex: "type",
		stateId: "type",
		renderer  : function (value) {
            var content;
            switch (value) {
            case 'alsa':
                content = _("ALSA");
                break;
            case 'ao':
                content = _("libao");
                break;
            case 'fifo':
                content = _("FIFO");
                break;
						case 'jack':
                content = _("JACK");
                break;
            case 'httpd':
                content = _("HTTP server");
                break;
            case 'null':
                content = _("Null (fake)");
                break;
						case 'oss':
                content = _("OSS");
                break;
						case 'openal':
                content = _("OpenAL");
                break;
						case 'osx':
                content = _("Mac OS X");
                break;
						case 'pipe':
								content = _("Pipe");
								break;
						case 'pulse':
								content = _("PulseAudio");
								break;
						case 'roar':
								content = _("RoarAudio");
								break;
						case 'recorder':
								content = _("File recorder");
								break;
						case 'shout':
								content = _("ShoutCast");
								break;
						case 'solaris':
								content = _("SUN Solaris");
								break;
            default:
                content = _("Unset");
                break;
            }
            return content;
        }
  },{
    header: _("Format"),
    flex: 1,
    sortable: true,
    dataIndex: "format",
		stateId: "format",
		renderer  : function (value) {
            var content;
            switch (value) {
            case '*:*:*':
                content = _("Default");
                break;
            case '8000:8:1':
                content = _("8 kHz, 8-bit, mono");
                break;
            case '16000:16:1':
                content = _("16 kHz, 16-bit, mono");
                break;
						case '22050:16:1':
                content = _("22.05 kHz, 16-bit, mono");
                break;
            case '44100:16:2':
                content = _("44.1 kHz, 16-bit, stereo");
                break;
            case '48000:16:2':
                content = _("48 kHz, 16-bit, stereo");
                break;
						case '96000:16:2':
                content = _("96 kHz, 16-bit, stereo");
                break;
						case '44100:24:2':
                content = _("44.1 kHz, 24-bit, stereo");
                break;
						case '48000:24:2':
                content = _("48 kHz, 24-bit, stereo");
                break;
						case '96000:24:2':
								content = _("96 kHz, 24-bit, stereo");
								break;
						case '192000:32:2':
								content = _("192 kHz, 32-bit, stereo");
								break;
            default:
                content = _("Default");
                break;
            }
            return content;
        }
  },{
    xtype: "booleaniconcolumn",
    header: _("Always on"),
    sortable: true,
    dataIndex: "always_on",
		stateId: "always_on",
    align: "center",
    width: 80,
    resizable: false,
    iconCls:  Ext.baseCSSPrefix + "grid-cell-booleaniconcolumn-switch"
  },{
    header: _("Mixer type"),
    flex: 1,
    sortable: true,
    dataIndex: "mixer_type",
		stateId: "mixer_type",
		renderer  : function (value) {
            var content;
            switch (value) {
            case 'hardware':
                content = _("Hardware");
                break;
            case 'software':
                content = _("Software");
                break;
            case 'null':
                content = _("Null");
						case 'none':
								content = _("None");
            default:
                content = _("Default");
                break;
            }
            return content;
        }
  },{
    header: _("ReplayGain handler"),
    flex: 1,
    sortable: true,
    dataIndex: "replaygain_handler",
		stateId: "replaygain_handler",
		renderer  : function (value) {
            var content;
            switch (value) {
            case 'software':
                content = _("Software");
                break;
            case 'mixer':
                content = _("Mixer");
						case 'none':
								content = _("None");
            default:
                content = _("Default");
                break;
            }
            return content;
        }			
  }],

	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			store: Ext.create("OMV.data.Store", {
				autoLoad: true,
				model: OMV.data.Model.createImplicit({
					idProperty: "uuid",
					fields: [
						{ name: "uuid", type: "string" },
						{ name: "name", type: "string" },
						{ name: "type", type: "string" },
						{ name: "format", type: "string" },
						{ name: "enabled", type: "boolean" },
						{ name: "tags", type: "boolean" },
						{ name: "always_on", type: "boolean" },
						{ name: "mixer_type", type: "string" },
						{ name: "replaygain_handler", type: "string" },
						{ name: "extra_options", type: "string" }
					]
				}),
				proxy: {
					type: "rpc",
					rpcData: {
						service: "Mpd",
						method: "getAudioOutputList"
					}
				},
				remoteSort: true,
				sorters: [{
					direction: "ASC",
					property: "name"
				}]
			})
		});
		me.callParent(arguments);
	},

	onAddButton: function() {
		var me = this;
		Ext.create("OMV.module.admin.service.mpd.AudioOutput", {
			title: _("Add audio output"),
			uuid: OMV.UUID_UNDEFINED,
			listeners: {
				scope: me,
				submit: function() {
					this.doReload();
				}
			}
		}).show();
	},

	onEditButton: function() {
		var me = this;
		var record = me.getSelected();
		Ext.create("OMV.module.admin.service.mpd.AudioOutput", {
			title: _("Edit audio output"),
			uuid: record.get("uuid"),
			listeners: {
				scope: me,
				submit: function() {
					this.doReload();
				}
			}
		}).show();
	},

	doDeletion: function(record) {
		var me = this;
		OMV.Rpc.request({
			scope: me,
			callback: me.onDeletion,
			rpcData: {
				service: "Mpd",
				method: "deleteAudioOutput",
				params: {
					uuid: record.get("uuid")
				}
			}
		});
	}
});

OMV.WorkspaceManager.registerPanel({
	id: "audiooutputs",
	path: "/service/mpd",
	text: _("Audio Outputs"),
	position: 20,
	className: "OMV.module.admin.service.mpd.AudioOutputs"
});
