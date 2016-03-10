/*
 * Copyright (C) 2011 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package net.motekulo.phonestrument;


import android.app.ActionBar;
import android.app.ActionBar.Tab;
import android.app.Activity;
import android.app.Fragment;
import android.app.FragmentTransaction;
import android.content.ActivityNotFoundException;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.os.IBinder;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

import com.google.analytics.tracking.android.EasyTracker;

import org.puredata.android.io.AudioParameters;
import org.puredata.android.service.PdService;
import org.puredata.android.utils.PdUiDispatcher;
import org.puredata.core.PdBase;
import org.puredata.core.utils.IoUtils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
//import android.support.v4.app.FragmentActivity;
//import android.support.v4.app.FragmentTabHost;
//import android.support.v4.view.ViewPager;

//import com.google.ads.AdRequest;
//import com.google.ads.AdSize;
//import com.google.ads.AdView;
//import com.google.analytics.tracking.android.EasyTracker;

public class PhonestrumentActivity extends Activity {
    //FragmentTabHost mTabHost;
    //ViewPager  mViewPager;
    public static final String ADMOB_MEDIATION_ID = "";
    private static final String APP_NAME = "Phonestrument";

    public static final String APP_DATA_DIR_NAME = "Phonestrument";
    private static final String SAMPLE_DIR_NAME = "samples";
    private static final int OPENPROJECT_ID = 1;
    private PdUiDispatcher dispatcher;
    boolean pdServiceConnection = false;
    private PdService pdService = null;
    private String sampleForPlayer1;
    private String sampleForPlayer2;
    private String sampleForPlayer3;
    private String sampleForPlayer4;
    private String sampleForPlayer5;
    private File player1Sample;
    private File player2Sample;
    private File player3Sample;
    private File player4Sample;
    private File player5Sample;
    private File samplesDir;
    private String currentProjectName;
    /**
     * ATTENTION: This was auto-generated to implement the App Indexing API.
     * See https://g.co/AppIndexing/AndroidStudio for more information.
     */



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.fragment_tabs_pager);

        ActionBar actionBar = getActionBar();
        actionBar.setDisplayHomeAsUpEnabled(true);
        actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_TABS);
        setTitle("Phonestrument");

        //Tab tab = actionBar.newTab()
//				.setText("Seq 1")
//				.setTabListener(new TabListener<SynthSequencerFragment>(
//						this, "synthseq", SynthSequencerFragment.class));
//		actionBar.addTab(tab);

//		tab = actionBar.newTab()
//				.setText("Seq 2")
//				.setTabListener(new TabListener<Synth2SequencerFragment>(
//						this, "synth2seq", Synth2SequencerFragment.class));
//		actionBar.addTab(tab);

        Tab tab = actionBar.newTab()
                .setText("Drums")
                .setTabListener(new TabListener<BeatSequencerFragment>(
                        this, "drums", BeatSequencerFragment.class));
        actionBar.addTab(tab);

        tab = actionBar.newTab()
                .setText("Mixer")
                .setTabListener(new TabListener<MixerFragment>(
                        this, "mixer", MixerFragment.class));
        actionBar.addTab(tab);

        tab = actionBar.newTab()
                .setText("Open")
                .setTabListener(new TabListener<OpenProject>(
                        this, "Open", OpenProject.class));
        actionBar.addTab(tab);
//		tab = actionBar.newTab()
//				.setText("Synths")
//				.setTabListener(new TabListener<SynthControllerFragment>(
//						this, "synth", SynthControllerFragment.class));
//		actionBar.addTab(tab);

        String filepath = Environment.getExternalStorageDirectory().getPath();
        File appdir = new File(filepath, APP_DATA_DIR_NAME);

        if (!appdir.exists()) {
            appdir.mkdirs();
        }

        samplesDir = new File(appdir, SAMPLE_DIR_NAME);
        if (!samplesDir.exists()) {
            samplesDir.mkdirs();
        }

        loadSamples(samplesDir);

        if (sampleForPlayer1 == "") {
            player1Sample = new File(samplesDir, "kick1.wav");
            sampleForPlayer1 = player1Sample.getAbsolutePath();

        } else {
            player1Sample = new File(sampleForPlayer1);
        }

        if (sampleForPlayer2 == "") {
            player2Sample = new File(samplesDir, "snare1.wav");
            sampleForPlayer2 = player2Sample.getAbsolutePath();

        } else {
            player2Sample = new File(sampleForPlayer2);
        }
        if (sampleForPlayer3 == "") {
            player3Sample = new File(samplesDir, "chh.wav");
            sampleForPlayer3 = player3Sample.getAbsolutePath();

        } else {
            player3Sample = new File(sampleForPlayer3);
        }

        if (sampleForPlayer4 == "") {
            player4Sample = new File(samplesDir, "ohh.wav");
            sampleForPlayer4 = player4Sample.getAbsolutePath();

        } else {
            player4Sample = new File(sampleForPlayer4);
        }

        if (sampleForPlayer5 == "") {
            player5Sample = new File(samplesDir, "cowbellsmallclosed.wav");
            sampleForPlayer5 = player5Sample.getAbsolutePath();

        } else {
            player5Sample = new File(sampleForPlayer5);
        }


        readPreferences();

        if (currentProjectName.equals("untitled")) {
            checkAndCreateUniqueProjectName();
        }

        createProjectDir();
        setPreferences();
        initSystemServices();
        bindService(new Intent(this, PdService.class), pdConnection, BIND_AUTO_CREATE);


    }

    public static class TabListener<T extends Fragment> implements ActionBar.TabListener {
        private Fragment mFragment;
        private final Activity mActivity;
        private final String mTag;
        private final Class<T> mClass;

        /**
         * Constructor used each time a new tab is created.
         *
         * @param activity The host Activity, used to instantiate the fragment
         * @param tag      The identifier tag for the fragment
         * @param clz      The fragment's Class, used to instantiate the fragment
         */
        public TabListener(Activity activity, String tag, Class<T> clz) {
            mActivity = activity;
            mTag = tag;
            mClass = clz;
        }

		/* The following are each of the ActionBar.TabListener callbacks */

        public void onTabSelected(Tab tab, FragmentTransaction ft) {
            // Check if the fragment is already initialized
            if (mFragment == null) {
                // If not, instantiate and add it to the activity
                mFragment = Fragment.instantiate(mActivity, mClass.getName());
                ft.add(android.R.id.content, mFragment, mTag);
            } else {
                // If it exists, simply attach it in order to show it
                ft.attach(mFragment);
            }
        }

        public void onTabUnselected(Tab tab, FragmentTransaction ft) {
            if (mFragment != null) {
                // Detach the fragment, because another one is being attached
                ft.detach(mFragment);
            }
        }

        public void onTabReselected(Tab tab, FragmentTransaction ft) {
            // User selected the already selected tab. Usually do nothing.
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        //outState.putString("tab", mTabHost.getCurrentTabTag());
    }

    @Override
    public void onStart() {
        super.onStart();
        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.


        EasyTracker.getInstance(this).activityStart(this);  // Add this method.
        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.

    }

    @Override
    public void onStop() {
        super.onStop();
        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.


        EasyTracker.getInstance(this).activityStop(this);  // Add this method.
        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.

    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        unbindService(pdConnection);
    }

    private void createProjectDir() {
        String dataPath = getExternalFilesDir(null).getPath();

        File appDir = new File(dataPath, APP_DATA_DIR_NAME);

        if (!appDir.exists()) {
            appDir.mkdirs();
        }

        File projectDir = new File(appDir, currentProjectName);
        if (!projectDir.exists()) {
            projectDir.mkdirs();
        }
    }

    private void initPatch() {

        // read preference info from project dir and load into patch

        String filepath = getExternalFilesDir(null).getPath();
        File appDir = new File(filepath, net.motekulo.phonestrument.PhonestrumentActivity.APP_DATA_DIR_NAME);
        File projectDir = new File(appDir,currentProjectName);

        File prefFile = new File(projectDir, "project_preferences.txt");
        if (prefFile.exists()) {
            // Reading is from Pd Patch perspective ( so loading from Android to Pd)

            PdBase.sendMessage("array_to_read", "symbol", prefFile.getPath()); // baseName is the same as the Pd array name
            PdBase.sendMessage("read_array", "symbol", "project_preferences");
            PdBase.sendBang("set_numbars_from_prefs");
        }
        // Some patch defaults, only if info missing from storage
        else {

            // Create one with some defaults and send to the patch

            PdBase.sendFloat("density", 4);
            PdBase.sendFloat("num_beats", 4);
            PdBase.sendFloat("num_bars", 4);
            PdBase.sendFloat("tempo", 112);

            // Now get Pd to write us the preference array to the project directory

            
        }

        // General starting defaults for patch

        PdBase.sendFloat("master_vol", 82);
        PdBase.sendFloat("drum_vol", 100);
        PdBase.sendFloat("drumplayer_on", 1);
        PdBase.sendFloat("metronome_sample_number", 8);
        PdBase.sendFloat("metronome_on", 1);
        PdBase.sendFloat("metro_on", 1);

        // Load up samples (eventually through prefs too?)

        PdBase.sendMessage("sample_to_play", sampleForPlayer1, 0);
        PdBase.sendMessage("sample2_to_play", sampleForPlayer2, 0);
        PdBase.sendMessage("sample3_to_play", sampleForPlayer3, 0);
        PdBase.sendMessage("sample4_to_play", sampleForPlayer4, 0);
        PdBase.sendMessage("sample5_to_play", sampleForPlayer5, 0);

        //PdBase.sendFloat("player_1_vol", (float) 0.75);


    }

    private final ServiceConnection pdConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            pdService = ((PdService.PdBinder) service).getService();
            try {
                initPd();
                loadPatch();
            } catch (IOException e) {
                Log.e(APP_NAME, e.toString());
                finish();
            }
            pdServiceConnection = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {

            pdServiceConnection = false;
        }
    };

    private void initPd() throws IOException {

        int sampleRate = AudioParameters.suggestSampleRate();
        pdService.initAudio(sampleRate, 0, 2, 10.0f);
        pdService.startAudio();
        start();

    }

    private void checkAndCreateUniqueProjectName() {
        int i = 1;
        String filepath = getExternalFilesDir(null).getPath();
        // String filepath = Environment.getDataDirectory().getPath();
        File appDir = new File(filepath, APP_DATA_DIR_NAME);
        String potentialProjectName = "Project_" + Integer.toString(i);
        File potentialProjectFileDir = new File(appDir, potentialProjectName);

        while (potentialProjectFileDir.isDirectory() == true) {
            i++;
            potentialProjectName = "Project_" + Integer.toString(i);
            potentialProjectFileDir = new File(appDir, potentialProjectName);
        }
        currentProjectName = potentialProjectName;
    }

    private void start() {
        if (!pdService.isRunning()) {
            Intent intent = new Intent(PhonestrumentActivity.this, PhonestrumentActivity.class);
            pdService.startAudio(intent, R.drawable.icon,
                    "Phonestrument", "Return to Phonestrument");
        }
    }

    private void loadPatch() throws IOException {
        File dir = getFilesDir();
        IoUtils.extractZipResource(getResources().openRawResource(R.raw.phonestrument), dir, true);

        File patchFile = new File(dir, "phonestrument.pd");
        PdBase.openPatch(patchFile.getAbsolutePath());
        initPatch();
    }

    private void initSystemServices() {
        TelephonyManager telephonyManager =
                (TelephonyManager) getSystemService(Context.TELEPHONY_SERVICE);
        telephonyManager.listen(new PhoneStateListener() {
            @Override
            public void onCallStateChanged(int state, String incomingNumber) {
                if (pdService == null) return;
                if (state == TelephonyManager.CALL_STATE_IDLE) {
                    start();
                } else {
                    pdService.stopAudio();
                }
            }
        }, PhoneStateListener.LISTEN_CALL_STATE);
    }

    private void loadSamples(File sampleDir) {
        // Really need to check whether these files exist first before writing them anyway...
        int[] sample_ids = new int[5];
        String outputName = "";
        File outputFile;
        sample_ids[0] = getResources().getIdentifier("kick1", "raw", "net.motekulo.phonestrument");
        sample_ids[1] = getResources().getIdentifier("snare1", "raw", "net.motekulo.phonestrument");
        sample_ids[2] = getResources().getIdentifier("ohh", "raw", "net.motekulo.phonestrument");
        sample_ids[3] = getResources().getIdentifier("chh", "raw", "net.motekulo.phonestrument");
        sample_ids[4] = getResources().getIdentifier("cowbellsmallclosed", "raw", "net.motekulo.phonestrument");

        for (int i = 0; i < sample_ids.length; i++) {

            InputStream ins = getResources().openRawResource(sample_ids[i]);
            String sampleName = getResources().getResourceEntryName(sample_ids[i]);

            outputName = sampleDir.getAbsolutePath() + "/" + sampleName + ".wav";
            outputFile = new File(outputName);
            if (!outputFile.exists()) {
                Log.i(APP_NAME, "File doesn't exist so creating");

                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                int size = 0;
                // Read the entire resource into a local byte buffer.
                byte[] buffer = new byte[1024];
                try {
                    while ((size = ins.read(buffer, 0, 1024)) >= 0) {
                        outputStream.write(buffer, 0, size);
                    }
                    ins.close();
                } catch (IOException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }

                buffer = outputStream.toByteArray();

                FileOutputStream fos;
                try {
                    //	outputName = sampleDir.getAbsolutePath() + "/" + sampleName + ".wav";
                    fos = new FileOutputStream(outputName);

                    fos.write(buffer);
                    fos.close();
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            } else {
                Log.i(APP_NAME, "File exists so skipping");
            }
        }

        readPreferences();
    }

    private void saveLoop() {
        //Log.i(APP_NAME, "Save test");
        readPreferences();
        String projectFileName = "testexport.wav";
        File fileToShare = new File(samplesDir, projectFileName);
        PdBase.sendMessage("keepit", fileToShare.getAbsolutePath(), 0);

        Intent myIntent = new Intent(Intent.ACTION_SEND).setType("audio/*");
        myIntent.putExtra(Intent.EXTRA_STREAM, Uri.fromFile(fileToShare));

        PackageManager packageManager = getPackageManager();
        List<ResolveInfo> activities = packageManager.queryIntentActivities(myIntent, 0);
        boolean isIntentSafe = activities.size() > 0;
        //Log.i(APP_NAME, "Number of activities to handle this type is " + activities.size());
        if (isIntentSafe) {
            startActivity(myIntent);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main, menu);
        return true;

    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {

            //		case R.id.menu_settings: {
            //			Intent i = new Intent(this, Settings.class);
            //			startActivityForResult(i, SETTINGS_ID);
            //			break;
            //		}
            //
            //		case R.id.menu_help: {
            //			Intent i = new Intent(this, BeatsAndLoopsHelp.class);
            //			startActivityForResult(i, HELP_ID);
            //			break;
            //		}

          /*  case R.id.menu_rate_app: {
//			Intent rateIntent = new Intent(Intent.ACTION_VIEW);
//			rateIntent.setData(Uri.parse("market://details?id=net.motekulo.phonstrument"));
//			if (mStartActivity(rateIntent) == false) {
//				// Try a browser
//				rateIntent.setData(Uri.parse("https://play.google.com/store/apps/details?id=net.motekulo.phonstrument"));
//				mStartActivity(rateIntent);
//			}
                break;
            }

            case R.id.menu_tell_friend: {
//			Intent tellIntent = new Intent(Intent.ACTION_SEND);
//			tellIntent.putExtra(Intent.EXTRA_SUBJECT, "Phonstrument - a great phone app for live sequencing");
//			tellIntent.putExtra(Intent.EXTRA_TEXT, "Check this out - https://play.google.com/store/apps/details?id=net.motekulo.phonstrument");
//			tellIntent.setType("plain/text");
//			startActivity(Intent.createChooser(tellIntent, "Tell a friend..."));
                break;
            }*/

            case R.id.toggle_on_off: {
                PdBase.sendBang("metro_on");
                break;
            }

            case R.id.new_project: {
                showNewProject();
                break;
            }



            case R.id.share_loop: {
                saveLoop();
                break;
            }



        }
        return true;
    }

    protected void onActivityResult(int requestCode, int resultCode, Intent data){
        // See which child activity is calling us back.
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case OPENPROJECT_ID:
                if (resultCode == RESULT_CANCELED) {
                    break;

                } else {
                    Log.i(APP_NAME, "Opening a project ");
                    // Read sample info from shared preferences
                    readPreferences();


                }
                break;
        }
    }


        private void testWriteArray() {

        readPreferences();
        String testFileName = "testreadarray.txt";
        File fileToTest = new File(samplesDir, testFileName);
        PdBase.sendMessage("test_read_array", fileToTest.getAbsolutePath(), 0);

    }

    private void showNewProject() {

        checkAndCreateUniqueProjectName();
        SharedPreferences preferences = getSharedPreferences("Phonestrument",
                MODE_PRIVATE);
        SharedPreferences.Editor editor = preferences.edit();

        editor.putString("CurrentProjectName", currentProjectName);
        editor.commit();
        readPreferences();
        createProjectDir();


    }



    private boolean mStartActivity(Intent intent) {
        try {
            startActivity(intent);
            return true;
        } catch (ActivityNotFoundException e) {
            return false;
        }
    }

    private void readPreferences() {
        SharedPreferences preferences = getSharedPreferences("Phonestrument", Context.MODE_PRIVATE);
        currentProjectName = preferences.getString("CurrentProjectName", "untitled");
        sampleForPlayer1 = preferences.getString("sample_player_1_filename", "");
        sampleForPlayer2 = preferences.getString("sample_player_2_filename", "");
        sampleForPlayer3 = preferences.getString("sample_player_3_filename", "");
        sampleForPlayer4 = preferences.getString("sample_player_4_filename", "");
        sampleForPlayer5 = preferences.getString("sample_player_5_filename", "");
        //numberOfBeats = preferences.getInt("number_of_beats", 4);

    }

    private void setPreferences() {
        SharedPreferences preferences = getSharedPreferences("Phonestrument",
                MODE_PRIVATE);
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString("CurrentProjectName", currentProjectName);
        editor.putString("sample_player_1_filename", sampleForPlayer1);
        editor.putString("sample_player_2_filename", sampleForPlayer2);
        editor.putString("sample_player_3_filename", sampleForPlayer3);
        editor.putString("sample_player_4_filename", sampleForPlayer4);
        editor.putString("sample_player_5_filename", sampleForPlayer5);

        editor.commit();
    }
}
