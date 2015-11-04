package net.motekulo.phonestrument;


import net.motekulo.phonestrument.HorizontalFader.HorizontalFaderPositionListener;

import org.puredata.core.PdBase;

import com.google.ads.AdRequest;
import com.google.ads.AdSize;
import com.google.ads.AdView;

import android.app.Fragment;
import android.os.Bundle;
//import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.LinearLayout;



public class SynthControllerFragment extends Fragment implements OnClickListener{
	protected static final String APP_NAME = "Phonstrument";
	private SynthPaintView mPaintView;
	private HorizontalFader fenvattBar;
	private HorizontalFader fdecayBar;
	private HorizontalFader frangeBar;
	private HorizontalFader ffreqBar;
	private HorizontalFader ampattBar;
	private HorizontalFader ampdecayBar;
	private HorizontalFader synth2AlphaBar;
	private HorizontalFader synth2AttackBar;
	private HorizontalFader synth2DecayBar;

	private float[] waveTableData;
	private AdView adView;

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {

		View view = inflater.inflate(R.layout.synth_controller, container, false);

		mPaintView = (SynthPaintView) view.findViewById(R.id.synthPaintView1);
		mPaintView.setTouchListener(pathChange);

		fenvattBar = (HorizontalFader) view.findViewById(R.id.horFader1);
		fenvattBar.setPositionListener(horFaderChanged);

		fdecayBar = (HorizontalFader) view.findViewById(R.id.horFader2);
		fdecayBar.setPositionListener(horFaderChanged);

		frangeBar = (HorizontalFader) view.findViewById(R.id.horFader3);
		frangeBar.setPositionListener(horFaderChanged);

		ffreqBar = (HorizontalFader) view.findViewById(R.id.horFader4);
		ffreqBar.setPositionListener(horFaderChanged);

		ampattBar = (HorizontalFader) view.findViewById(R.id.horFader5);
		ampattBar.setPositionListener(horFaderChanged);

		ampdecayBar = (HorizontalFader) view.findViewById(R.id.horFader6);
		ampdecayBar.setPositionListener(horFaderChanged);

		synth2AlphaBar = (HorizontalFader) view.findViewById(R.id.horFader7);
		synth2AlphaBar.setPositionListener(horFaderChanged);

		synth2AttackBar = (HorizontalFader) view.findViewById(R.id.horFader8);
		synth2AttackBar.setPositionListener(horFaderChanged);

		synth2DecayBar = (HorizontalFader) view.findViewById(R.id.horFader9);
		synth2DecayBar.setPositionListener(horFaderChanged);


		waveTableData = new float[256];
		initAds(view);
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
	public void onActivityCreated (Bundle savedInstanceState){
		//super.onStart();
		super.onActivityCreated(savedInstanceState);
		//Log.i(APP_NAME, "Synth controller onActivityCreated");
		float[] settingsArray = new float[9];

		PdBase.readArray(settingsArray, 0, "synth_1_settings", 0, 9);
		// the settings array holds vol and fatness in 0 and 1; values between 0 and 1 for all

		fenvattBar.setmKnobPosition((int) (settingsArray[2]*100));		
		fdecayBar.setmKnobPosition((int) (settingsArray[3]*100));
		frangeBar.setmKnobPosition((int) (settingsArray[4]*100));
		ffreqBar.setmKnobPosition((int) (settingsArray[5]*100));
		ampattBar.setmKnobPosition((int) (settingsArray[6]*100)); 
		ampdecayBar.setmKnobPosition((int) (settingsArray[7]*100));

		PdBase.readArray(waveTableData, 0, "wavetable", 0, 256);

		mPaintView.setLineData(waveTableData); 
	}

	private SynthPaintView.touchListener pathChange = new SynthPaintView.touchListener() {

		@Override
		public void onPositionChange(View view, float[] lineData) {

			PdBase.writeArray("wavetable", 0, lineData, 0, 256);

		}
	};

	public void updateDetail() {

		Log.i("Phonstrument", "In the fragment test");
		PdBase.sendFloat("tempo", 200);
	}

	private HorizontalFader.HorizontalFaderPositionListener horFaderChanged = new HorizontalFaderPositionListener() {
		@Override
		public void onPositionChange(View fader, int newPosition) {
			float progress = (float)(newPosition/(float)100);
			switch (fader.getId()) {

			case R.id.horFader1:
				PdBase.sendFloat("fenva", progress);
				break;

			case R.id.horFader2:
				PdBase.sendFloat("fdecay", progress);
				break;

			case R.id.horFader3:
				PdBase.sendFloat("frange", progress);
				break;
			
			case R.id.horFader4:
				PdBase.sendFloat("ffreq", progress);
				break;

			case R.id.horFader5:
				PdBase.sendFloat("ampatt", progress);
				break;

			case R.id.horFader7:
				mPaintView.setAlphaSmoothing(progress);	
				break;

			case R.id.horFader8:
				PdBase.sendFloat("synth_2_attack", progress);
				break;

			case R.id.horFader9:
				PdBase.sendFloat("synth_2_decay", progress);
				break;

			}
		}
	};

	@Override
	public void onClick(View v) {

	}

}
