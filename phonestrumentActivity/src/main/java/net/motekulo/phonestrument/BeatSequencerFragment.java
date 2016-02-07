package net.motekulo.phonestrument;


import android.app.Fragment;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;
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

//import android.support.v4.app.Fragment;
//import android.app.Fragment;

public class BeatSequencerFragment extends Fragment {
	protected static final String APP_NAME = "Phonestrument";
	//private boolean pdServiceConnection = false;
	//private PdService pdService = null;
	private PdUiDispatcher dispatcher;
	private XYControllerBeatView beatView1;
    private XYControllerBeatView beatView2;
	private EditText tempoBox;
	private int pulsesPerBeat;
    private int numBeats;
    private int currentBar;
	float[][] sequence;

	//private AdView adView;
	

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {

		View view = inflater.inflate(R.layout.beat_sequencer, container, false);

		tempoBox = (EditText) view.findViewById(R.id.editText1);
		tempoBox.setOnEditorActionListener(tempoEditorChanged);
		
		beatView1 = (XYControllerBeatView) view.findViewById(R.id.beatToggleArrayView1);
		beatView1.setTouchListener(beatArray1Touched);

		beatView1.setXmax(16);

        beatView2 = (XYControllerBeatView) view.findViewById(R.id.beatToggleArrayView2);
       // beatView1.setTouchListener(beatArray1Touched);

        beatView2.setXmax(1);

		sequence = new float[4][16];

		PdBase.sendBang("ping_patch_for_info");

		updateBeatArrayView();
		//initAds(view);

        dispatcher = new PdUiDispatcher();
        PdBase.setReceiver(dispatcher);

        dispatcher.addListener("num_beats_info", new PdListener.Adapter() {

            @Override
            public void receiveFloat(String source, float x) {
                Log.i(APP_NAME, "num_beats_info: " + x);
                numBeats = (int) x;
            }

        });

        dispatcher.addListener("density_info", new PdListener.Adapter() {

            @Override
            public void receiveFloat(String source, float x) {
                Log.i(APP_NAME, "density_info: " + x);
                pulsesPerBeat = (int) x;
            }

        });

        dispatcher.addListener("beatnum", new PdListener.Adapter() {
            @Override
            public void receiveFloat(String source, float x) {


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
                Log.i(APP_NAME, "Bar " + x);
                // Scroll to correct bar (well, display it)

				updateBeatArrayView(currentBar);
			}
		});

		return view;
	}

	private void initAds(View view){

//		adView = new AdView(getActivity(), AdSize.BANNER, PhonestrumentActivity.ADMOB_MEDIATION_ID);
//		LinearLayout layout = (LinearLayout)view.findViewById(R.id.linearLayoutAds);
//		layout.addView(adView);
//
//		AdRequest adRequest = new AdRequest();
//		adRequest.addKeyword("music");
//		adRequest.addTestDevice(AdRequest.TEST_EMULATOR);
//
//		adRequest.addTestDevice("12381B9A705131137970D2814E8CC388");  // Dc's One X
//		//adRequest.addTestDevice("56E337CEE1A1F13B4D5893C791141867");  // Dc's tablet
//		//adRequest.addTestDevice("AE349F5766106ACA46B96E2922980361");  // Gima's phone
//
//		adView.loadAd(adRequest);
	}
	
	@Override
	public void onResume() {
		super.onResume();
		updateBeatArrayView();
	}

	private touchListener beatArray1Touched = new XYControllerBeatView.touchListener() {

		@Override
		public void onPositionChange(View view, int col, int row, int value) {
			
			String drSequenceToWrite = null;
			sequence[col][row] = value;

			switch (col){
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
			PdBase.writeArray(drSequenceToWrite, startOfBarInPulses, sequence[col], 0, pulsesPerBeat * numBeats);

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
				Log.i(APP_NAME, "Tempo is " + v.getText());
				Float tempo = Float.valueOf(v.getText().toString());
				PdBase.sendFloat("tempo", tempo);
				handled = true;
			}
			return handled;
		}
	};

	private void updateBeatArrayView(){
		
		int[][] beatArray = new int[4][16];
		
		PdBase.readArray(sequence[0], 0, "dr1_sequence", 0, 16);
		PdBase.readArray(sequence[1], 0, "dr2_sequence", 0, 16);
		PdBase.readArray(sequence[2], 0, "dr3_sequence", 0, 16);
		PdBase.readArray(sequence[3], 0, "dr4_sequence", 0, 16);
		
		for (int i=0; i < 4; i++) {
			for (int j=0; j< 16; j++) {
				beatArray[i][j] = (int) sequence[i][j];
			}
		}
		beatView1.setToggleState(beatArray);
	}
    private void updateBeatArrayView(int barnum){

        int barSize = pulsesPerBeat * numBeats;
        int startOfBarInPulses = barSize * barnum;
        int[][] beatArray = new int[4][barSize];

        PdBase.readArray(sequence[0], 0, "dr1_sequence", startOfBarInPulses, barSize);
        PdBase.readArray(sequence[1], 0, "dr2_sequence", startOfBarInPulses, barSize);
        PdBase.readArray(sequence[2], 0, "dr3_sequence", startOfBarInPulses, barSize);
        PdBase.readArray(sequence[3], 0, "dr4_sequence", startOfBarInPulses, barSize);

        for (int i=0; i < 4; i++) {
            for (int j=0; j< 16; j++) {
                beatArray[i][j] = (int) sequence[i][j];
            }
        }
        beatView1.setToggleState(beatArray);
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