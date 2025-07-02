# Jitsi Meet We.Team 

This is a fork of https://github.com/jitsi/jitsi-meet

## Developing

Follow this guide for instuctions on how to run jitsi-meet in development mode

https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-web-jitsi-meet

Important: Use node 22+

```
# https://meet-105.we.team can be replaced by whichever jitsi server url we are currently using at we.team
export WEBPACK_DEV_SERVER_PROXY_TARGET=https://meet-105.we.team && make dev
```

## Testing

To test changes on our test server:

### Build the package

Run the following command to create a source package:

```sh
make && make source-package
```

### Copy build to the server manually

For test releases, instead of re-creating the entire infrastructure stack we can copy and install `jitsi-meet.tar.bz2` on the test jitsi server.

Find the jitsi server in AWS e.g. `jitsi-meet-server-test` and copy the connection string:

e.g. `ssh -i "otxSL1.pem" ubuntu@ec2-3-235-151-226.compute-1.amazonaws.com`

Copy the package to the server:

```
scp -i otxSL1.pem jitsi-meet.tar.bz2 ubuntu@ec2-3-235-151-226.compute-1.amazonaws.com:/home/ubuntu
```

Connect to the server:

`ssh -i "otxSL1.pem" ubuntu@ec2-3-235-151-226.compute-1.amazonaws.com`

```sh
# move our package to /tmp
mv jitsi-meet.tar.bz2 /tmp
cd /tmp
# remove the previous installation
rm jitsi-meet-weteam.deb weteamweb/ -rf
```

Run the lines from the following file to install our package:

https://github.com/otixo-inc/Infrastructure/blob/d93b774b1f2e968cc4d13463ed079493fc49c303/jitsi-aws/assets/userdata/jms.sh#L47-L59

Restart the server:

```
/etc/init.d/jicofo restart ; /etc/init.d/prosody restart ; /etc/init.d/nginx restart
```

The server is now running the package built from our source code. 

## Releasing

### Build the package

Run the following command to create a source package:

```sh
make && make source-package
```

### Create a GitHub Release

Visit https://github.com/otixo-inc/jitsi-meet/releases and create a new release and include jitsi-meet.tar.bz2 as a release asset.

### Create the infrastructure

Follow the instructions here to create a new jitsi stack in AWS with latest package:

https://github.com/otixo-inc/Infrastructure/blob/master/jitsi-aws/README.md#create-a-stack

## Synching our fork with the Jitsi origin

If we want to include new Jitsi features in our fork, we need to merge changes from the original jitsi repository.

Find the release of Jitsi we want to merge: https://github.com/jitsi/jitsi-meet/releases.

The release should be tagged. e.g. `stable/jitsi-meet_10314`

```
# Add the original source code as a remote
git remote add origin https://github.com/jitsi/jitsi-meet.git

# Create a new branch
git checkout -b we-team-10314

# Merge the branch from remote with our local branch (stable/jitsi-meet_10314 is the tag name)
git merge stable/jitsi-meet_10314

# Resolve any conflicts and open a PR in GitHub to merge we-team-10314 with our main branch
```

Our forked repo should now be up to date with the original repository and still include our custom changes.

We don't rebase because we would need to resolve the same conflicts every time we pull from the original repository.