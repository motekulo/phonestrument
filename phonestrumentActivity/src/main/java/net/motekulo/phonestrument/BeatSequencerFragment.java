/*
 * Copyright (C) 2016 Denis Crowdy
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


import android.app.Fragment;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.TextView.OnEditorActionListener;

import net.motekulo.phonestrument.XYControllerBeatView.touchListener;

import org.puredata.android.utils.PdUiDispatcher;
import org.puredata.core.PdBase;
import org.puredata.core.PdListener;

import java.io.File;

//import android.support.v4.app.Fragment;
//import android.app.Fragment;

public class BeatSequencerFragment extends Fragment {
	protected static final String APP_NAME = "Phonestrument";
	//private boolean pdServiceConnection = false;
	//private PdService pdService = null;
	private PdUiDispatcher dispatcher;
	private XYControllerBeatView beatView1;
    private XYControllerBeatView barView;
	private EditText tempoBox;
	private int pulsesPerBeat;
    private int numBeats;
    private int numBars;
    private int beatNum; //current beat
    private int currentBar;
	float[][] sequence;
    private EditText numbarsBox;
    private EditText numbeatsBox;
    private EditText numpulsesBox;
    private String currentProjectName;
    private File projectDir;


    @Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {

		View view = inflater.inflate(R.layout.beat_sequencer, container, false);

		tempoBox = (EditText) view.findViewById(R.id.editText1);
		tempoBox.setOnEditorActionListener(tempoEditorChanged);

        numbarsBox = (EditText) view.findViewById(R.id.editText2);
        numbarsBox.setOnEditorActionListener(numbarsEditorChanged);

        numbeatsBox = (EditText) view.findViewById(R.id.editText3);
        numbeatsBox.setOnEditorActionListener(numbeatsEditorChanged);

        numpulsesBox = (EditText) view.findViewById(R.id.editText4);
        numpulsesBox.setOnEditorActionListener(numpulsesEditorChanged);
		
		beatView1 = (XYControllerBeatView) view.findViewById(R.id.beatToggleArrayView1);
		beatView1.setTouchListener(beatArray1Touched);
        // set some defaults
        beatView1.setXmax(16);
		beatView1.setYmax(4);

        barView = (XYControllerBeatView) view.findViewById(R.id.barView);
       // barView.setTouchListener(beatArray1Touched);

        barView.setXmax(4);
        barView.setYmax(1);

		sequence = new float[4][16];

        /* Keep as much state in the backend as possible and use that as the ultimate source rather
         than duplicating data. Here we have a message that bangs a number of float boxes in the pd
         patch that then sends their values to which the listeners listen.
         */
        PdBase.sendBang("ping_patch_for_info");

		updateBeatArrayView();
        readPreferences();
        // Get the base directory for saving patch arrays
        String dataPath = getActivity().getExternalFilesDir(null).getPath();

        File appDir = new File(dataPath, net.motekulo.phonestrument.PhonestrumentActivity.APP_DATA_DIR_NAME);

        projectDir = new File(appDir, currentProjectName);

        dispatcher = new PdUiDispatcher();
        PdBase.setReceiver(dispatcher);

        dispatcher.addListener("num_bars_info", new PdListener.Adapter() {

            @Override
            public void receiveFloat(String source, float x) {
                //Log.i(APP_NAME, "num_beats_info: " + x);
                numBars = (int) x;
                barView.setXmax(numBars);
            }

        });

        dispatcher.addListener("num_beats_info", new PdListener.Adapter() {

            @Override
            public void receiveFloat(String source, float x) {
                //Log.i(APP_NAME, "num_beats_info: " + x);
                numBeats = (int) x;
                beatView1.setXmax(numBeats * pulsesPerBeat);
            }

        });

        dispatcher.addListener("density_info", new PdListener.Adapter() {

            @Override
            public void receiveFloat(String source, float x) {
                //Log.i(APP_NAME, "density_info: " + x);
                pulsesPerBeat = (int) x;
                beatView1.setXmax(numBeats * pulsesPerBeat);
            }

        });

        dispatcher.addListener("current_pulse_num", new PdListener.Adapter() {
            @Override
            public void receiveFloat(String source, float x) {
               // Log.i(APP_NAME, "pulse: " + x);
                beatNum = (int) x;
//				if (playState == false) {
//					Log.i(APP_NAME, "Dispatcher and playstate false ");
//					PdBase.sendFloat("metro_on", 0);
//				}

//				beatView1.setCurrentBeat((int) x);
//
//				if (x == 0) {
//					updateBeatArrayView(0);
//				}

            }
        });

		dispatcher.addListener("current_bar_num", new PdListener.Adapter() {


			@Override
			public void receiveFloat(String source, float x) {
				//Log.i(APP_NAME, "Getting bar number " + x);
				currentBar = (int) x;
               // Log.i(APP_NAME, "Bar " + x);
                // Scroll to correct bar (well, display it)

				updateBeatArrayView(currentBar);
			}
		});

		return view;
	}

	
	@Override
	public void onResume() {
		super.onResume();
		updateBeatArrayView();
        readPreferences();
	}

	private touchListener beatArray1Touched = new XYControllerBeatView.touchListener() {

		@Override
		public void onPositionChange(View view, int row, int col, int value) {
			
			String drSequenceToWrite = null;
			sequence[row][col] = value;

			switch (row){
			case 0:				
				drSequenceToWrite = "dr1_sequence";
				break;
			case 1:
				drSequenceToWrite = "dr2_sequence";
				break;
			case 2:
				drSequenceToWrite = "dr3_sequence";
				break;
			case 3:
				drSequenceToWrite = "dr4_sequence";
				break;
				
			}
            int startOfBarInPulses = pulsesPerBeat * numBeats * currentBar;
			PdBase.writeArray(drSequenceToWrite, startOfBarInPulses, sequence[row], 0, pulsesPerBeat * numBeats);
            String arrayFilename = projectDir + "/" + drSequenceToWrite + ".txt";
           // Log.i(APP_NAME, "Log test: " + arrayFilename);
            PdBase.sendMessage("array_to_write", "symbol", arrayFilename);
            PdBase.sendMessage("write_array", "symbol", drSequenceToWrite);

			updateBeatArrayView(currentBar);
		}
	};


	private TextView.OnEditorActionListener tempoEditorChanged =  new OnEditorActionListener() {
		@Override
		public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {

			boolean handled = false;
			if (actionId == EditorInfo.IME_ACTION_DONE) {
				InputMethodManager imm = (InputMethodManager)getActivity().getSystemService(
						Context.INPUT_METHOD_SERVICE);
				imm.hideSoftInputFromWindow(tempoBox.getWindowToken(), 0);
				//Log.i(APP_NAME, "Tempo is " + v.getText());
				Float tempo = Float.valueOf(v.getText().toString());
				PdBase.sendFloat("tempo", tempo);
				handled = true;
			}
			return handled;
		}
	};

    private TextView.OnEditorActionListener numbarsEditorChanged =  new OnEditorActionListener() {
        @Override
        public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {

            boolean handled = false;
            if (actionId == EditorInfo.IME_ACTION_DONE) {
                InputMethodManager imm = (InputMethodManager)getActivity().getSystemService(
                        Context.INPUT_METHOD_SERVICE);
                imm.hideSoftInputFromWindow(tempoBox.getWindowToken(), 0);
                //Log.i(APP_NAME, "Tempo is " + v.getText());
                Float bars = Float.valueOf(v.getText().toString());
                PdBase.sendFloat("num_bars", bars);
                handled = true;
            }
            return handled;
        }
    };

    private TextView.OnEditorActionListener numbeatsEditorChanged =  new OnEditorActionListener() {
        @Override
        public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {

            boolean handled = false;
            if (actionId == EditorInfo.IME_ACTION_DONE) {
                InputMethodManager imm = (InputMethodManager)getActivity().getSystemService(
                        Context.INPUT_METHOD_SERVICE);
                imm.hideSoftInputFromWindow(tempoBox.getWindowToken(), 0);
                //Log.i(APP_NAME, "Tempo is " + v.getText());
                Float beats = Float.valueOf(v.getText().toString());
                PdBase.sendFloat("num_beats", beats);
                PdBase.sendBang("ping_patch_for_info");  // the actual view changes will be made in the dispatcher listener
                handled = true;
            }
            return handled;
        }
    };

    private TextView.OnEditorActionListener numpulsesEditorChanged =  new OnEditorActionListener() {
        @Override
        public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {

            boolean handled = false;
            if (actionId == EditorInfo.IME_ACTION_DONE) {
                InputMethodManager imm = (InputMethodManager)getActivity().getSystemService(
                        Context.INPUT_METHOD_SERVICE);
                imm.hideSoftInputFromWindow(tempoBox.getWindowToken(), 0);
                //Log.i(APP_NAME, "Tempo is " + v.getText());
                Float pulsesperbeat = Float.valueOf(v.getText().toString());
                PdBase.sendFloat("density", pulsesperbeat);
                PdBase.sendBang("ping_patch_for_info");  // the actual view changes will be made in the dispatcher listener
                handled = true;
            }
            return handled;
        }
    };

	private void updateBeatArrayView(){
// pinged info might not have returned from backend so set some defaults in case
        if (numBeats == 0) numBeats = 4;
        if (pulsesPerBeat == 0) pulsesPerBeat = 4;
        ;

        int pulsesPerBar = numBeats * pulsesPerBeat;
//		int[][] beatArray = new int[4][16];
        int[][] beatArray = new int[4][pulsesPerBar];


        PdBase.readArray(sequence[0], 0, "dr1_sequence", 0, 16);
		PdBase.readArray(sequence[1], 0, "dr2_sequence", 0, 16);
		PdBase.readArray(sequence[2], 0, "dr3_sequence", 0, 16);
		PdBase.readArray(sequence[3], 0, "dr4_sequence", 0, 16);
		
		for (int i=0; i < 4; i++) {
			for (int j=0; j< pulsesPerBar; j++) {
				beatArray[i][j] = (int) sequence[i][j];
			}
		}
		beatView1.setToggleState(beatArray);
	}
    private void updateBeatArrayView(int barnum){
        if (numBeats == 0) {numBeats = 4;}
        if (pulsesPerBeat == 0) {pulsesPerBeat = 4;};
        int pulsesPerBar = pulsesPerBeat * numBeats;
        int startOfBarInPulses = pulsesPerBar * barnum;
        int[][] beatArray = new int[4][pulsesPerBar];
        int[][] barArray = new int[1][numBars];

        PdBase.readArray(sequence[0], 0, "dr1_sequence", startOfBarInPulses, pulsesPerBar);
        PdBase.readArray(sequence[1], 0, "dr2_sequence", startOfBarInPulses, pulsesPerBar);
        PdBase.readArray(sequence[2], 0, "dr3_sequence", startOfBarInPulses, pulsesPerBar);
        PdBase.readArray(sequence[3], 0, "dr4_sequence", startOfBarInPulses, pulsesPerBar);

        for (int i=0; i < 4; i++) {
            for (int j=0; j< pulsesPerBar; j++) {
                beatArray[i][j] = (int) sequence[i][j];
            }
        }
        beatView1.setToggleState(beatArray);

        for (int i=0; i < 1; i++) {
            for (int j=0; j< numBars; j++) {
                if (currentBar == j) {
                    barArray[i][j] = 1;
                } else {
                    barArray[i][j] = 0;
                }
            }
        }
        barView.setToggleState(barArray);

    }

    private void readPreferences() {
        SharedPreferences preferences = getActivity().getSharedPreferences("Phonestrument", Context.MODE_PRIVATE);

        currentProjectName = preferences.getString("CurrentProjectName", "untitled");


    }

//	private final ServiceConnection pdConnection = new ServiceConnection() { 
//
//		@Override
//		public void onServiceConnected(ComponentName name, IBinder service) { 
//			pdService = ((PdService.PdBinder)service).getService();
//
//			pdServiceConnection = true;
//		}
//
//		@Override
//		public void onServiceDisconnected(ComponentName name) {
//
//			pdServiceConnection = false;
//		}
//	};

}