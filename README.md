# Drawing App

A simple drawing tool for marking up a page of text using HTML5 canvas.

### Version

1.0.0

---

![Screenshot](readme/screenshot.png?raw=true)

## Usage

On intial page load you are in drawing mode.  Click once to add text or click/drag to add a line.

![Screenshot](readme/objects.png?raw=true)

You can select 1 or more objects and move/rotate/scale them.

![Transform](readme/transform.png?raw=true)

You can delete all objects or only the selected objects.  For selected objects you can use the delete key on the keyboard.  If no items are selected and you use the delete buttons, it will tell you this (but not using the delete key as it's not user-friendly).

All data is saved to local storage for later retrieval.

When adding text, arrows and labels are not grouped making it possible to reposition them wherever and however you want.

## Resources

### Libraries Used

All libraries managed with Bower.

1. jQuery
2. Fabric as the canvas library
3. Spectrum for color picker (Have used Farbtastic in the past but it is no longer maintained)

### Tools Used

CodeKit - https://incident57.com/codekit/

This was used to:

* Compile less
* Minify/combine css/js files
* Convert this markdown file into html

## Directory Structure

### root

* index.html - The application
* .bowerrc - Where to store bower components 
* .editorconfig - Rules for saving source files
* .gitattributes - Normalize line endings for versioning
* .gitignore - What to remove from git (decided to not ignore bower components)
* bower.json - The packages/dependencies installed
* browserconfig.xml - Configuration for handling MS tile icons
* crossdomain.xml - Cross-domain policy file
* humans.txt - Meet the team and the technologies used
* robots.txt - Crawler configuration
* favicon and other icons

### assets

* css - the minified/compiled css files used
* images - any images used
* js - source js files and the minified compiled files used by the app (in 'min').  Uses CodeKit.
* less - the source of the compiled css files
* vendor - the installed bower components


## Testing

Tested on Mac: Firefox, Chrome, Safari


### Known Issues

* Fabric isn't storing the color for objects into its exported JSON string.  It will do this if lines are created with points passed into the constructor, but not if dynamically being modified.  In the latter case it stores the color as HSV intead of RGB and can't read it back in.
* In Safari color is ignored outright.
* Make it responsive.
