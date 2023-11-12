# python dependencies lambda layer

opencv-python takes more that 50Mb so a lambda layer was created manually.
The needed `requirements.txt` can be used to create a new layer.

First create a folder that has the followin structure:

```
layer
└── lib
    └── python3.11
        └── site-packages
            └── requirements.txt
```

Then in the `site-packages` directory, run

```
pip install -r requirements.txt -t .
cd ../../../..
zip -r python.zip python
```

Then upload that zip to a s3 bucket and serve the dependencies to a lambda layer from there.

## ffmpeg layer instructions

Get a static build for amd or arm depending on the layer architecture from https://johnvansickle.com/ffmpeg/.

Extract `ffmpeg` and `ffprobe` files from the build.

Setup the following directory structure

```
layer
└── lib
    ├── ffmpeg
    └── ffprobe
```

and run

```
zip -r ffmpeg.zip layer
```

In the same fashion as with python, upload the zip file to s3 and provide it to a lambda layer.
