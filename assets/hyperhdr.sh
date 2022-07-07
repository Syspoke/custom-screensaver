#!/bin/sh
# Automatically elevate Homebrew Channel service
if [[ -x /media/developer/apps/usr/palm/services/org.webosbrew.hbchannel.service/elevate-service ]]; then
/media/developer/apps/usr/palm/services/org.webosbrew.hbchannel.service/elevate-service
fi

# Run user startup hooks
if [[ -d /var/lib/webosbrew/init.d ]]; then
run-parts /var/lib/webosbrew/init.d
fi
