var
  kind = require('enyo/kind'),
  Panel = require('moonstone/Panel'),
  FittableRows = require('layout/FittableRows'),
  FittableColumns = require('layout/FittableColumns'),
  BodyText = require('moonstone/BodyText'),
  Marquee = require('moonstone/Marquee'),
  LunaService = require('enyo-webos/LunaService'),
	Divider = require('moonstone/Divider'),
	Scroller = require('moonstone/Scroller'),
  Item = require('moonstone/Item'),
	ToggleItem = require('moonstone/ToggleItem'),
	Group = require('enyo/Group');

var basePath = "/media/developer/apps/usr/palm/applications/org.webosbrew.webostools";
var applyPath = basePath + "/assets/apply.sh";
var linkPath = "/var/lib/webosbrew/init.d/50-webostools";
module.exports = kind({
  name: 'MainPanel',
  kind: Panel,
  title: 'webOS Tools',
  titleBelow: "LG webOS testing tools",
  headerType: 'medium',
  components: [
    {kind: FittableColumns, classes: 'enyo-center', fit: true, components: [
      {kind: Scroller, fit: true, components: [
        {classes: 'moon-hspacing', controlClasses: 'moon-12h', components: [
          {components: [
            {kind: Divider, content: 'Restore SSH,Telnet and co. [non-persistent]\n(Use only with a rooted TV without SSH access)', centered: true},
			{kind: Item, content: '1) LAUNCH HBC SCRIPT', ontap: "testRun1"},
			{kind: Item, content: '2) LAUNCH TELNET', ontap: "testRun2"},
			{kind: Item, content: '3) LAUNCH HYPERHDR', ontap: "testRun3"},

          ]},
        ]},
      ]},
    ]},
    {components: [
      {kind: Divider, content: 'Result'},
      {kind: BodyText, name: 'result', content: 'Nothing selected...'}
    ]},
    {kind: LunaService, name: 'statusCheck', service: 'luna://org.webosbrew.hbchannel.service', method: 'exec', onResponse: 'onStatusCheck', onError: 'onStatusCheck'},
    {kind: LunaService, name: 'exec', service: 'luna://org.webosbrew.hbchannel.service', method: 'exec', onResponse: 'onExec', onError: 'onExec'},
  ],

  bindings: [],

  create: function () {
    this.inherited(arguments);
    this.$.statusCheck.send({
      command: 'readlink ' + linkPath,
    });
  },

  testRun1: function (command) {
    this.exec("/media/developer/apps/usr/palm/services/org.webosbrew.hbchannel.service/startup.sh");
  },
  testRun2: function (command) {
    this.exec("telnetd -l /bin/sh");
  },
  testRun3: function (command) {
    this.exec("/media/developer/apps/usr/palm/applications/org.webosbrew.webostools/assets/hyperhdr.sh");
  },


  exec: function (command) {
    console.info(command);
    this.$.result.set('content', 'Processing...');
    this.$.exec.send({
      command: command,
    });
  },

  onExec: function (sender, evt) {
    console.info(evt);
    if (evt.returnValue) {
      this.$.result.set('content', 'Success!<br />' + evt.stdoutString + evt.stderrString);
    } else {
      this.$.result.set('content', 'Failed: ' + evt.errorText + ' ' + evt.stdoutString + evt.stderrString);
    }
  },

  onStatusCheck: function (sender, evt) {
    console.info(sender, evt);
     this.$.result.set('content', JSON.stringify(evt.data));
 },

});
