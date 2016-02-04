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
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.TextView.OnEditorActionListener;

import com.google.ads.AdRequest;
import com.google.ads.AdSize;
import com.google.ads.AdView;

import net.motekulo.phonestrument.XYControllerBeatView.touchListener;

import org.puredata.core.PdBase;

//import android.support.v4.app.Fragment;
//import android.app.Fragment;

public class BeatSequencerFragment extends Fragment {
	protected static final String APP_NAME = "Phonstrument";
	//private boolean pdServiceConnection = false;
	//private PdService pdService = null;

	private XYControllerBeatView beatView1;
	private EditText tempoBox;
	
	float[][] sequence;

	private AdView adView;
	

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {

		View view = inflater.inflate(R.layout.beat_sequencer, container, false);

		tempoBox = (EditText) view.findViewById(R.id.editText1);
		tempoBox.setOnEditorActionListener(tempoEditorChanged);
		
		beatView1 = (XYControllerBeatView) view.findViewById(R.id.beatToggleArrayView1);
		beatView1.setTouchListener(beatArray1Touched);

		sequence = new float[4][16];

		updateBeatArrayView();
		//initAds(view);
		return view;
	}

	private void initAds(View view){

		adView = new AdView(getActivity(), AdSize.BANNER, PhonestrumentActivity.ADMOB_MEDIATION_ID);
		LinearLayout layout = (LinearLayout)view.findViewById(R.id.linearLayoutAds);
		layout.addView(adView);

		AdRequest adRequest = new AdRequest();
		adRequest.addKeyword("music");
		adRequest.addTestDevice(AdRequest.TEST_EMULATOR);

		adRequest.addTestDevice("12381B9A705131137970D2814E8CC388");  // Dc's One X
		//adRequest.addTestDevice("56E337CEE1A1F13B4D5893C791141867");  // Dc's tablet
		//adRequest.addTestDevice("AE349F5766106ACA46B96E2922980361");  // Gima's phone

		adView.loadAd(adRequest);
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
				drSequenceToWrite = "dr_sequence_1";
				break;
			case 1:
				drSequenceToWrite = "dr_sequence_2";
				break;
			case 2:
				drSequenceToWrite = "dr_sequence_3";
				break;
			case 3:
				drSequenceToWrite = "dr_sequence_4";
				break;
				
			}
			
			PdBase.writeArray(drSequenceToWrite, 0, sequence[col], 0, 16);

			updateBeatArrayView();
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
		
		PdBase.readArray(sequence[0], 0, "dr_sequence_1", 0, 16);
		PdBase.readArray(sequence[1], 0, "dr_sequence_2", 0, 16);
		PdBase.readArray(sequence[2], 0, "dr_sequence_3", 0, 16);
		PdBase.readArray(sequence[3], 0, "dr_sequence_4", 0, 16);
		
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